"use strict"
require('shelljs/global')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var fetch = require('node-fetch')
var co = require('co')
var glob = require('glob')
var ora = require('ora')
var Promise = require('promise')
var Bagpipe = require('bagpipe')
var utils = require('./utils')
var config = require('../config')
var httpClient = require('./http-client')
var socketClient = require('./socket-client')
var argv = require('minimist')(process.argv)

var outPath = utils.getFullPath('outPath')
var NODE_ENV = env.NODE_ENV = argv.env || 'production'
var spinner = ora()

console.log('Notice：正在上传请稍后...')
spinner.start()
spinner.text = `Uploading static files for ${NODE_ENV}...`
deployAssets().then(function () {
    spinner.text = `Uploading template for ${NODE_ENV}...`
    // spinner.stopAndPersist()
    return deployTmpl()
}).then(function () {
    spinner.text = `上传成功`
    spinner.succeed()
}).catch(function (e) {
    spinner.text = `上传失败`
    spinner.fail()
    console.log(e)
})

function deployTmpl() {
    return new Promise(function (resolve, reject) {
        // 模板部署
        var tmplEnv = NODE_ENV === 'production' ? 'prod' : 'prev'
        var task1 = loadLocalTemplateInfo()
        var task2 = fetchRemoteTemplateInfo()
        Promise.all([task1, task2]).then(function (data) {
            var local = data[0]
            var remote = data[1]
            // var putQueue = []
            // var patchQueue = []
            var queue = []
            // 替换def
            replaceDef(local, tmplEnv)
            co(function* () {
                for (let dir in local.dirs) {
                    var remoteTemplates = []
                    var folderId = ''
                    if (remote.folders[dir] == null) {
                        folderId = yield httpClient.createRemoteDirectory(dir, config.build.leonRootfolderId)
                    } else {
                        folderId = remote.folders[dir][0].id
                        let res = yield httpClient.fetchRemoteDirectory(folderId)
                        remoteTemplates = _.groupBy(JSON.parse(res.result), 'name')
                    }
                    local.dirs[dir].forEach(function (file) {
                        var template = remoteTemplates[file.name] ? remoteTemplates[file.name][0] : null
                        file.folderId = folderId
                        if (template) {
                            file.id = template.id
                            // patchQueue.push(file)
                            queue.push({
                                file: file,
                                type: 'patch'
                            })
                        } else {
                            // putQueue.push(file)
                            queue.push({
                                file: file,
                                type: 'put'
                            })
                        }
                    })
                }

                var bagpipe = new Bagpipe(1)
                // var redisConfig = buildConfig('redis')
                // var sites = Object.keys(redisConfig)
                // var remoteRedisConfig = {}
                // for (let i = 0; i < sites.length; i++) {
                //     let ret = yield httpClient.getConf({ key: sites[i] })
                //     Object.assign(remoteRedisConfig, ret ? JSON.parse(ret) : {})
                // }
                var raw = fs.readFileSync('./.hashconfig')
                var obj = JSON.parse(raw)
                console.log('\n上传的页面有：')
                queue.forEach(function (item) {
                    console.log(item.file.subpath)
                    bagpipe.push(httpClient.uploadTemplate, item.file, item.type, tmplEnv, item.isText, function (err, data, file) {
                        if(err){
                            obj['output\\sites\\' + file.subpath] = ''
                            console.log(err)
                        }
                        if (bagpipe.queue.length === 0) {
                            updateHash()
                            resolve('模板上传成功')
                        }
                    })
                })

                function updateHash(){
                    var key = NODE_ENV === 'testing' ? 'dj_front_pc_qa' : 'dj_front_pc_prod'
                    httpClient.setConf({
                        key: key,
                        value: JSON.stringify(obj)
                    })
                }
            })
        })
    })
}

function deployAssets() {
    return new Promise(function (resolve, reject) {
        if (NODE_ENV === 'testing') {
            // 静态资源部署
            utils.zipDir(path.join(outPath, 'static'), path.join(outPath, new Date().getTime() + '.zip'))
                .then(function (data) {
                    return data.path
                }).then(function (filename) {
                    socketClient.connect().send(filename, function (data) {
                        if (data.data === true) {
                            rm('-rf', filename)
                            this.disconnect()
                            resolve('模板上传成功')
                        } else {
                            reject(new Error('uploaded error'))
                        }
                        // spinner.stopAndPersist()
                    })
                })
        } else {
            // 静态资源部署
            glob(outPath + "/static/**", { nodir: true }, function (er, files) {
                var bagpipe = new Bagpipe(100)
                var total = files.length
                var remain = total
                var failed = []
                // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`
                files.forEach(function (file) {
                    bagpipe.push(httpClient.uploadFile, file, function (err, data) {
                        remain--;
                        if (err || data.code !== 0) {
                            failed.push(err.toString())
                        }
                        // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`

                        if (!remain) {
                            // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}\n  ${failed.join('\n  ')}`
                            // spinner.succeed()
                        }
                        if (bagpipe.queue.length === 0) {
                            resolve('模板上传成功')
                        }
                    })
                })
                // var defs = []
                // files.forEach(function (file) {
                //     defs.push(httpClient.uploadFile(file))
                // })
                // spinner.text = `Uploading static files for ${NODE_ENV}... total: ${files.length}`
                // Promise.all(defs).then(function (data) {
                //     var filter = data.filter(function (v) {
                //         return typeof v === 'string'
                //     })
                //     if (filter.length) {
                //         filter.forEach(function (m) { console.log(m) })
                //     } else {
                //         // console.log('\n  Notice: 资源上传成功')
                //     }
                //     spinner.succeed()
                // })
            })
        }
    })
}

/**
 * @return {dirs: {a: [{file: file, subpath: subpath, filename: filename}]}, files: []}
 */
function loadLocalTemplateInfo() {
    var outPath = utils.getFullPath('outPath')
    var sitesRoot = path.join(outPath, '_sites')
    var result = {}
    return new Promise(function (resolve, reject) {
        glob(sitesRoot + "/**/**", { nodir: true }, function (er, files) {
            if (er) {
                return reject(er)
            }
            result.files = files
            result.dirs = {}
            files.forEach(function (file) {
                var subpath = path.relative(sitesRoot, file)
                var arr = subpath.split(path.sep)
                var dir = arr[0]
                var type = arr.indexOf('views') > -1 ? 2 : 1
                var name = subpath
                    .replace(path.extname(subpath), '')
                    .replace('_sites\\', '')
                    .replace(/\\\d+(?=\\)/g, '') // 所有纯数字命名的文件夹都被当成日期需要被去除
                    .replace(/\\/g, '_')
                name = name.toLowerCase() // node站全部取小写的key
                // 如果是专题目录那么加上 dujia前缀
                if(name.startsWith('activity')){
                    name = 'dujia_' + name
                }
                var desc = ''
                var isText = arr[0] === 'dujia' ? true : false
                result.dirs[dir] || (result.dirs[dir] = [])
                result.dirs[dir].push({
                    file: file,
                    subpath: subpath,
                    name: name,
                    desc: desc,
                    type: type,
                    isText: isText
                })
            })
            resolve(result)
        })
    })
}

/**
 * @return {folders: {OldTemplate: [], OldTemplate2: []}}
 */
function fetchRemoteTemplateInfo() {
    var result = {}
    return httpClient.fetchRemoteDirectory(config.build.leonRootfolderId).then(function (data) {
        result.folders = _.groupBy(JSON.parse(data.result), 'name')
        return result
    })
}

// 正式环境 模板部署

// if (NODE_ENV === 'production') {
//     // 静态资源部署
//     glob(outPath + "/static/**", { nodir: true }, function (er, files) {
//         var bagpipe = new Bagpipe(100)
//         var total = files.length
//         var remain = total
//         var failed = []
//         spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`
//         files.forEach(function (file) {
//             bagpipe.push(httpClient.uploadFile, file, function (err, data) {
//                 remain--;
//                 if (err || data.code !== 0) {
//                     failed.push(err.toString())
//                 }
//                 spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`

//                 if (!remain) {
//                     spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}
//                     \n  ${failed.join('\n  ')}`
//                     spinner.succeed()
//                 }
//             })
//         })

//         // var defs = []
//         // files.forEach(function (file) {
//         //     defs.push(httpClient.uploadFile(file))
//         // })
//         // spinner.text = `Uploading static files for ${NODE_ENV}... total: ${files.length}`
//         // Promise.all(defs).then(function (data) {
//         //     var filter = data.filter(function (v) {
//         //         return typeof v === 'string'
//         //     })
//         //     if (filter.length) {
//         //         filter.forEach(function (m) { console.log(m) })
//         //     } else {
//         //         // console.log('\n  Notice: 资源上传成功')
//         //     }
//         //     spinner.succeed()
//         // })
//     })

//     // 模板部署
// }

// if (NODE_ENV === 'testing') {
//     // 静态资源部署
//     utils.zipDir(path.join(outPath, 'static'), path.join(outPath, new Date().getTime() + '.zip'))
//         .then(function (data) {
//             return data.path
//         }).then(function (filename) {
//             socketClient.connect().send(filename, function (data) {
//                 if (data.data === true) {
//                     rm('-rf', filename)
//                     this.disconnect()
//                 } else {
//                     console.log('Error: uploaded error')
//                 }
//                 spinner.stopAndPersist()
//             })
//         })
// }

// // 模板部署
// var tmplEnv = NODE_ENV === 'production' ? 'prod' : 'prev'
// Promise.all([loadLocalTemplateInfo(), fetchRemoteTemplateInfo()]).then(function (data) {
//     var local = data[0]
//     var remote = data[1]
//     // var putQueue = []
//     // var patchQueue = []
//     var queue = []
//     co(function* () {
//         for (let dir in local.dirs) {
//             var remoteTemplates = []
//             var folderId = ''
//             if (remote.folders[dir] == null) {
//                 folderId = yield httpClient.createRemoteDirectory(dir, config.build.leonRootfolderId)
//             } else {
//                 folderId = remote.folders[dir][0].id
//                 let res = yield httpClient.fetchRemoteDirectory(folderId)
//                 remoteTemplates = _.groupBy(JSON.parse(res.result), 'name')
//             }
//             local.dirs[dir].forEach(function (file) {
//                 var template = remoteTemplates[file.name] ? remoteTemplates[file.name][0] : null
//                 file.folderId = folderId
//                 if (template) {
//                     file.id = template.id
//                     // patchQueue.push(file)
//                     queue.push({
//                         file: file,
//                         type: 'patch'
//                     })
//                 } else {
//                     // putQueue.push(file)
//                     queue.push({
//                         file: file,
//                         type: 'put'
//                     })
//                 }
//             })
//         }

//         var bagpipe = new Bagpipe(5)
//         var redisConfig = buildConfig('redis')
//         var sites = Object.keys(redisConfig)
//         var remoteRedisConfig = {}
//         for (let i = 0; i < sites.length; i++) {
//             let ret = yield httpClient.getConf({ key: sites[i] })
//             Object.assign(remoteRedisConfig, ret ? JSON.parse(ret) : {})
//         }
//         queue.forEach(function (item) {
//             bagpipe.push(httpClient.uploadTemplate, item.file, item.type, tmplEnv, function (err, data) {
//             })
//         })
//         // putQueue.forEach(function (file) {
//         //     bagpipe.push(httpClient.uploadTemplate, file, 'put', function (err, data) {

//         //     })
//         // })
//         // patchQueue.forEach(function (file) {
//         //     bagpipe.push(httpClient.uploadTemplate, file, 'patch', function (err, data) {

//         //     })
//         // })
//     })
// })
// 狮子座配置
// var lionConfig = buildConfig('lion')

// 用http请求来上传模板
// httpClient.login().then(() => {
//     return Object.keys(lionConfig).map((key) => {
//         return httpClient.saveTmpl(lionConfig[key])
//     })
// }).then(defs => {
//     return Promise.all(defs)
// }).then((data) => {
//     // 理论上要判断下data是否成功
//     console.log('模板上传成功')
// }).catch((e) => {
//     console.log(e)
// })


// var maintain = maintainConfig()
// var defs = Object.keys(maintain).map(key => {
//     return httpClient.setConf(maintain[key]).then(res => res.text())
// })
// Promise.all(defs)
//     .then(data => {
//         var result = data.reduce((a, b) => {
//             if (a === 'true' && b === 'true') {
//                 return 'true'
//             } else {
//                 return 'false'
//             }
//         })
//         if (result === 'true') {
//             console.log('配置上传成功')
//         }
//     })

// 生成配置
// @name {String} 配置名称
function buildConfig(name) {
    var rTitle = /<title>([^<]*)<\/title>/
    var source = utils.getResource(outPath)
    var namespace = config.build.namespace
    var sourceDir = outPath
    var result = {}

    // 主模板
    source.filter(file => /\.html?$/.test(file.filename)).forEach(file => {
        var htmlFile = fs.readFileSync(file.path).toString()
        var ret = rTitle.exec(htmlFile)
        var desc = ret ? ret[0] : ''
        var relativePath = file.path.replace(sourceDir, '')
        var templateName = namespace + path.dirname(relativePath).replace('_sites\\', '').replace(/\\/g, '_')
        var site = namespace + '_' + path.dirname(relativePath).split(path.sep)[1]

        if (name === 'redis') {
            result[site] || (result[site] = {})
            Object.assign(result[site], {
                [relativePath]: {
                    templateDesc: desc,
                    templateName: templateName,
                    templateContent: htmlFile,
                }
            })
        } else {
            Object.assign(result, {
                [relativePath]: {
                    tplDesc: desc,
                    templateName: templateName,
                    templateContent: htmlFile,
                    type: '预发布模板',
                    tplType: 1
                }
            })
        }
    })

    // if (name === 'lion') {
    // 子模板
    source.filter(file => /\.dot$/.test(file.filename)).forEach(file => {
        var dotFile = fs.readFileSync(file.path)
        var relativePath = file.path.replace(sourceDir, '')
        var templateName = namespace + relativePath.replace(path.extname(relativePath), '').replace('_sites\\', '').replace(/\\/g, '_')
        var site = namespace + '_' + path.dirname(relativePath).split(path.sep)[1]

        if (name === 'redis') {
            result[site] || (result[site] = {})
            Object.assign(result[site], {
                [relativePath]: {
                    templateDesc: templateName,
                    templateName: templateName,
                    templateContent: dotFile,
                    type: '预发布模板',
                    tplType: 2
                }
            })
        } else {
            Object.assign(result, {
                [relativePath]: {
                    tplDesc: '子模板 ' + templateName,
                    templateName: templateName,
                    templateContent: dotFile,
                    type: '预发布模板',
                    tplType: 2
                }
            })
        }
    })

    // }

    return result
}
function replaceDef(config, tmplEnv) {
    var files = config.files
    var rDef = /\{\{#def\.([\s\S]+?)\}\}/g
    var sitesRoot = path.join(outPath, '_sites')

    files.filter(function (file) {
        return /\.html$/.test(file)
    }).forEach(function (file) {
        var routeConfig;
        try {
            routeConfig = JSON.parse(fs.readFileSync(path.dirname(file.replace('_sites', 'sites')) + '/config.json'))
        } catch (e) {
            routeConfig = {}
        }
        var views = routeConfig.views || './views'
        fs.writeFileSync(file, fs.readFileSync(file).toString().replace(rDef, function (ref, def) {
            var defPath = path.resolve(path.dirname(file), views, def)
            var defSubpath = path.relative(sitesRoot, defPath)
            var name = defSubpath.replace(/\\/g, '_')
            name = name.toLowerCase()
            if(tmplEnv === 'prod'){
                return `<% includeId = ${name} %>`
            }else{
                return `<% includeId *= ${name} %>`
            }
            
        }))
    })
}
// 替换def标签
// @name {String} 配置名称
// function replaceDef(config, name) {
//     var rDef = /\{\{#def\.([\s\S]+?)\}\}/g
//     name = name || 'lion'
//     if (name === 'lion') {
//         Object.keys(config).filter(function (subpath) {
//             return /\.html$/.test(subpath)
//         }).forEach(function (subpath) {
//             var info = config[subpath]
//             var subTplIds = []
//             info.templateContent = info.templateContent.toString().replace(rDef, function (ref, def) {
//                 var defSubpath = path.join(path.dirname(subpath), 'views', def) + '.dot'
//                 subTplIds.push(config[defSubpath].templateName)
//                 return `<% includeId *= ${config[defSubpath].templateName} %>`
//             })

//             info.incTplId = subTplIds.join('.')
//         })
//     } else {
//         _.each(config, (a, site) => {
//             _.each(config[site], (b, subpath) => {
//                 var info = config[site][subpath]
//                 var subTplIds = []
//                 info.templateContent = info.templateContent.toString().replace(rDef, function (ref, def) {
//                     var defSubpath = path.join(path.dirname(subpath), 'views', def) + '.dot'
//                     subTplIds.push(config[site][defSubpath].templateName)
//                     return config[site][defSubpath].templateContent
//                 })
//                 info.incTplId = subTplIds.join('.')
//             })
//         })
//     }
// }

// // 站点配置表
// function maintainConfig() {
//     var source = utils.getFullPath('outPath')
//     var sourceDir = utils.getFullPath('outPath')
//     var result = {}
//     utils.getResource(source).filter(file => file.filename === 'maintain.json').forEach(file => {
//         var jsonFile = fs.readFileSync(file.path)
//         var relativePath = file.path.replace(sourceDir, '')
//         var key = namespace + '_test_' + relativePath.replace('sites\\', '').replace(path.extname(relativePath), '').replace(/\\/g, '_')
//         Object.assign(result, {
//             [relativePath]: {
//                 key: key,
//                 value: JSON.stringify(jsonFile)
//             }
//         })
//     })
//     return result
// }

// 更新
// var patchQueue = []
// // 新增
// var postQueue = []

// function fetchFolderId() {
//     return "57a9a09b0a23ea2c52a73242"
// }

// function fetchFolderList() {
//     return []
// }

// function save() {

// }

// patchQueue.push(function (cb) {
//     fetchFolderId().then(function (id) {
//         return save({})
//     }).then((data) => {


//     })
// })
// function dequeue(queue) {
//     fn = queue.shift()
//     if (fn) {
//         fn.call(null, function () {
//             dequeue(queue)
//         })
//     }
// }