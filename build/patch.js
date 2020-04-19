var fs = require('fs');
var path = require('path')
var utils = require('./utils')
var Promise = require('promise')
var Bagpipe = require('bagpipe')
var fetch = require('node-fetch')
var glob = require('glob')

function diff(table1, table2) {
  var ret = []
  Object.keys(table1).forEach(function (filepath) {
    if (table2[filepath] === table1[filepath]) {
      return
    }
    ret.push(filepath)
  })
  return ret
}

function getRemoteTableP(env) {
  var key = 'cruise_front_m_' + env
  var url = 'http://wx.t.17u.cn/intervacation/redis?key='+ key +'&type=get'
  return fetch(url).then(function (res) {
    return res.json()
  }).then(function (data) {
    return data
  })
}

function loadLocalTableP() {
  return new Promise(function (resolve, reject) {
    glob('./dest/pages/**/*.html', function (err, files) {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  }).then(function (files) {
    return new Promise(function (resolve, reject) {
      var ret = {}
      var bagpipe = new Bagpipe(100)
      files.forEach(function (file) {
        bagpipe.push(fs.readFile, file, function (err, data) {
          if (err) {
            reject(err)
          } else {
            ret[file] = utils.md5(data.toString())
          }
          if (bagpipe.queue.length === 0) {
            resolve(ret)
          }
        })
      })
    })
  })
}
module.exports = function patch(env) {
  return Promise.all([getRemoteTableP(env), loadLocalTableP()]).then(function(data){
    return [diff(data[1], data[0]), data[1]]
  })
}