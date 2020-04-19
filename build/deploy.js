'use strict';
var path = require('path')
var co = require('co')
var del = require('del')
var _ = require('lodash')
var gulp = require('gulp')
var glob = require('glob')
var Bagpipe = require('bagpipe')
var debug = require('debug')('deploy:')
var gutil = require('gulp-util')
var inquirer = require('inquirer')
var Promise = require('promise')
var utils = require('./utils')
var config = require('../config')
var socketClient = require('./socket-client')(config.socket)
var httpClient = require('./http-client')
var getToken = require('./getToken')

var log = gutil.log
var colors = gutil.colors
var namespace = config.namespace
var NODE_ENV = process.env.NODE_ENV || 'testing'
var TMPl_ENV = process.env._TMPL_ENV || 'testing'
var tmplEnv = NODE_ENV === 'testing' ? 'prev' : 'prod' 
var sitesRoot = path.join(__dirname, '../dest/pages')

var patch = require('./patch')

// 狮子座初始化的目录结构，索引代表层级
var remoteDirectory = [];
// var remoteDirectory = TMPl_ENV === 'offlinetesting'
//   ? [[{ name: "邮轮营销前端小组", id: '57b6be8979bf6c8767e4c2d4' }]]
//   : [[{ name: "邮轮营销前端小组", id: '57b552a3eb710abdd97204a1' }]]
switch(TMPl_ENV){
  case 'testing':
  case 'production':
    remoteDirectory = [[{ name: "邮轮营销前端小组", id: '57b552a3eb710abdd97204a1' }]]; break;
  case 'offlinetesting':
    remoteDirectory = [[{ name: "邮轮营销前端小组", id: '57b6be8979bf6c8767e4c2d4' }]]; break;
}
var localDirectory = loadLocalDirectory()
var targetDir = '邮轮营销前端小组/M'

module.exports = function () {
  co(function* () {
    yield getToken(TMPl_ENV)
    yield syncDirectory(targetDir)
    yield deployAssets()
    let table = yield deployTmpl()
    yield updateHash(table)
  }).catch(function(err){
    err.message += `\n确认用户名、密码是否输入正确`
    log(err)
  })
}
function* deployTmpl() {
  // var raw = glob.sync(sitesRoot + "/**/**", { nodir: true })
  var arr = yield patch(TMPl_ENV)
  var diffs = arr[0]
  var table = arr[1]
  var files = diffs.map(function (filepath) {
    return path.relative(sitesRoot, filepath)
  })
  var ret = {}
  var queue = []
  for (let i = 0; i < files.length; i++) {
    var filename = files[i]
    var index = i
    var dirname = path.dirname(filename)
    var dirs = dirname.split(path.sep)
    var name = namespace + '_' + dirname.replace(/\\/g, '_') + '_' + path.basename(filename, '.html')
    var parentFolderName = dirs.slice(-1)[0]
    var level = targetDir.split('/').length + dirs.length

    // 查找模板的id
    if (lookupFoldId(name, level) === null) {
      let parentFolderId = lookupFoldId(parentFolderName, level - 1)
      if (!remoteDirectory[level]) {
        remoteDirectory[level] = []
      }

      remoteDirectory[level] = remoteDirectory[level].concat(yield fetchRemoteDirectory(parentFolderId))
    }
    var folderId = lookupFoldId(parentFolderName, level - 1)
    var id = lookupFoldId(name, level)
    ret[filename] = {
      name: name,
      level: level,
      folderId: folderId,
      id: id,
      file: diffs[index],
      desc: '',
      type: 1
    }
  }
  Object.keys(ret).forEach(function (subpath) {
    var fileObj = ret[subpath]
    var name = fileObj.name
    var level = fileObj.level
    if (hasRemoteTeplateInfo(name, level)) {
      queue.push({
        type: 'patch',
        file: fileObj
      })
    } else {
      queue.push({
        type: 'put',
        file: fileObj
      })
    }
  })
  yield dequeue(queue, table)
  return table
}

function* updateHash(obj){
  var key = 'cruise_front_m_' + TMPl_ENV
  httpClient.setConf({
    key: key,
    value: JSON.stringify(obj)
  })
}

function dequeue(queue, table) {
  var bagpipe = new Bagpipe(1)
  var failed = []
  return new Promise(function (resolve, reject) {
    queue.forEach(function (item) {
      bagpipe.push(httpClient.uploadTemplate, item.file, item.type, tmplEnv, false, function (err, data) {
        if (err || data.code !== 0) {
          failed.push({ file: item.file, res: data })
        } else {
          log(colors.green(item.file.name, '上传成功'))
        }
        if (bagpipe.queue.length === 0) {
          if (failed.length) {
            reject(failed)
          } else {
            resolve('success')
          }
        }
      })
    })
  }).catch(function (failed) {
    failed.forEach((item) => {
      var filepath = item.file.file
      table[filepath] = ''
      error(filepath, item.res && item.res.msg)
    })
  })
}

function error() {
  return log(colors.red.apply(this, arguments))
}

function hasRemoteTeplateInfo(folderName, level) {
  var dirs = remoteDirectory[level]
  if (dirs) {
    for (var i = 0; i < dirs.length; i++) {
      if (dirs[i].name === folderName) {
        return true
      }
    }
  }
  return false
}

/**
 * 部署静态资源
 */
function deployAssets() {
  return new Promise(function (resolve, reject) {
    if (NODE_ENV === 'testing') {
      // 静态资源部署
      var inPath = path.join(__dirname, '../dest/public')
      var outPath = path.join(__dirname, '../dest', new Date().getTime() + '.zip')
      utils.zipDir(inPath, outPath)
        .then(function (data) {
          return data.path
        }).then(function (filename) {
          socketClient.connect().send(filename, function (data) {
            if (data.data === true) {
              del.sync(filename)
              // rm('-rf', filename)
              this.disconnect()
              log(colors.green('资源上传成功'))
              resolve('脚本样式上传成功')
            } else {
              reject(new Error('脚本样式上传错误'))
            }
          })
        })
    } else {
      // 静态资源部署
      glob("dest/public/**", { nodir: true }, function (er, files) {
        var bagpipe = new Bagpipe(100)
        var total = files.length
        var failed = []
        files.forEach(function (file) {
          bagpipe.push(httpClient.uploadFile, file, function (err, data) {
            // remain--;
            if (err || data.code !== 0) {
              failed.push(err.toString())
            }
            if (bagpipe.active === 0) {
              log(colors.green('静态资源上传成功'))
              resolve('静态资源上传成功')
            }
          })
        })
      })
    }
  })
}

/**
 * 同步目录
 * 
 */
function* syncDirectory(to) {
  var i, j, k,
    i = j = k = 0
  var toDirs = to.split('/')
  var level = toDirs.length
  var root = toDirs.slice(-1)[0]
  for (; k < toDirs.length; k++) {
    let folderName = toDirs[k]
    let folderId = lookupFoldId(folderName, k)
    if (folderId === null) {
      let parentFolderName = toDirs[k - 1]
      let parentFolderId = lookupFoldId(parentFolderName, k - 1)
      remoteDirectory.push(yield fetchRemoteDirectory(parentFolderId))
      if (lookupFoldId(folderName, k) === null) {
        break;
      }
    }
  }
  for (; i < localDirectory.length; i++) {
    let localDir = localDirectory[i]
    // 去除重复的目录
    let dirs = uniq(localDir)
    level += i
    // bug
    for (j = i === 0 ? 0 : level; j < dirs.length; j++) {
      if (dirs[j]) {
        let folderName = dirs[j]
        let folderId = lookupFoldId(folderName, level)
        if (folderId === null) {
          // 如果找不到父级目录那么就是root
          var parentFolderName = localDirectory[i - 1] && localDirectory[i - 1][j] || root
          var parentFolderId = lookupFoldId(parentFolderName, level - 1)
          remoteDirectory.push(yield fetchRemoteDirectory(parentFolderId))
          // 再次查找
          folderId = lookupFoldId(folderName, level)
          if (folderId === null) {
            if (!remoteDirectory[level]) {
              remoteDirectory[level] = []
            }
            remoteDirectory[level].push(yield createRemoteDirectory(folderName, parentFolderId))
          }
        }
      }

    }
  }
}

/**
 * 查找目录id
 */
function lookupFoldId(folderName, level) {
  var dirs = remoteDirectory[level]
  if (dirs) {
    for (var i = 0; i < dirs.length; i++) {
      if (dirs[i].name === folderName) {
        return dirs[i].id
      }
    }
  }
  return null
}

/**
 * 获取远程狮子座目录结构
 */
function* fetchRemoteDirectory(folderId) {
  folderId = folderId || config.build.leonRootfolderId
  return httpClient.fetchRemoteDirectory(folderId).then(function (data) {
    return JSON.parse(data.result)
  })
}
/**
 * 获取本地目录结构
 */
function loadLocalDirectory() {
  var files = glob.sync('dest/pages/**/')
  var dirs = files.map(function (filepath) {
    return path.relative(sitesRoot, filepath)
  })

  return parseDirs(dirs)
}
/**
 * 解析目录
 * '[dist/pages/home', 'dist/pages2/home']
 * => [['dist', 'dist'], ['pages', 'pages2'], ['home', 'home']]
 */
function parseDirs(dirs) {
  var tmp = []
  dirs.forEach(function (dir) {
    if (dir) {
      tmp.push(parsePath(dir))
    }
  })
  return _.zip.apply(null, tmp)
}
/**
 * 解析路径
 */
function parsePath(pathname) {
  return pathname.split(path.sep)
}
/**
 * 创建远程目录
 */
function* createRemoteDirectory(folderName, parentFolderId) {
  return httpClient.createRemoteDirectory(folderName, parentFolderId)
}

function uniq(arr) {
  var ret = []
  for (var i = 0; i < arr.length; i++) {
    var val = arr[i]
    if (val === undefined || ret.indexOf(val) == -1) {
      ret.push(val)
    }
  }
  return ret
}