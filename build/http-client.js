var fs = require('fs')
var path = require('path')
var fetch = require('node-fetch')
var _ = require('lodash')
var FormData = require('form-data')
var config = require('../config')
var utils = require('./utils')
var Promise = require('promise')
var glob = require('glob')
var co = require('co')
var Bagpipe = require('bagpipe')
var qs = require('querystring')

const pId = '57a99bc60a23ea2c52a7320d'
var Client = function () {
    this.redisUrl = 'http://wx.t.17u.cn/intervacation/redis'
}

// Client.prototype.login = function () {
//     var loginConf = config.http.login
//     var username = this.username = loginConf.username
//     var password = this.password = loginConf.password
//     var self = this

//     return fetch(loginConf.url, {
//         method: 'POST',
//         body: `username=${username}&password=${password}`,
//         headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
//     }).then(function (res) {
//         return self.cookie = res.headers.get('set-cookie').split(';')[0]
//     })
// }

// Client.prototype.saveTmpl = function (option) {
//     var self = this
//     var saveConf = config.http.save
//     option = Object.assign({
//         // 模板名称
//         templateName: 'sty_test',
//         // 模板内容
//         templateContent: '<span>您好，欢迎使用LY.com访问同程！</span>',
//         // 模板描述
//         tplDesc: '测试模板',
//         // 子模板名称
//         incTplId: '',
//         // soa接口
//         soaSourceId: '',
//         // 标签名称
//         tagName: '',
//         // 模板模式
//         type: '预发布模板',
//         // 模板类型 1：模板 2： 模板片段 3： 模块
//         tplType: 1,
//         // 固定头
//         httpHeader: '{"respContentType":"text/plain","reqContentType":"text/plain","reqMethod":"get"}'
//     }, option)
//     option.tplDesc = option.tplDesc || option.templateDesc
//     var body = Object.keys(option).map(function (key) {
//         return `${encodeURIComponent(key)}=${encodeURIComponent(option[key])}`
//     }).join('&')

//     return fetch(saveConf.url, {
//         headers: {
//             "cookie": 'userCookie=' + self.username + ';' + self.cookie,
//             "content-type": 'application/x-www-form-urlencoded; charset=UTF-8'
//         },
//         body: body,
//         method: 'POST'
//     }).then(function (res) {
//         return res.json()
//     }).then(function (data) {
//         if (data.templateId) {
//             return true
//         } else {
//             return false
//         }
//     }).catch(function (e) {
//         console.log(e)
//     })
// }

Client.prototype.setConf = function (option) {
    option = Object.assign({
        url: this.redisUrl,
        type: 'set',
        key: '',
        value: ''
    }, option)
    fetch(option.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `key=${option.key}&type=set&value=${encodeURIComponent(option.value)}`
    }).then((res) => {
        return res.text()
    })
}
Client.prototype.getConf = function (option) {
    option = Object.assign({
        url: this.redisUrl,
        type: 'get',
        key: ''
    }, option)

    return fetch(option.url + `?key=${option.key}&type=get`).then((res) => { return res.text() })
}

// Client.prototype.fetchTmpl = function (key) {
//     var url = config.http.preview.url.replace('${templateName}', key)
//     return fetch(url).then(res => {
//         return res.text()
//     })
// }
// 上传静态资源
Client.prototype.uploadFile = function (file, callback) {
    var url = config.leon.uploadfileAddress
    var subpath = path.relative(utils.getFullPath('outPath') + '/static', file).replace(/\\/g, '/')
    var form = new FormData();
    form.append('userToken', token());
    form.append('pId',pId)
    form.append('bucketName', config.build.bucket);
    form.append('key', subpath);
    form.append('file', fs.readFileSync(file).toString('base64'));

    return fetch(url, { method: 'put', body: form }).then(function (res) {
        return res.json()
    }).then(function (data) {
        callback.call(null, null, data)
    }).catch(function (e) {
        callback.call(null, new Error(subpath + ' upload error'))
    })
}
// 上传模板
Client.prototype.uploadTemplate = function (file, type, env, isText, callback) {
    if (type === 'put') {
        putTemplate(file, env, isText).then(function (data) {
            if(data.code === 4004){
                callback.call(null, data.msg, null, file)
            }else{
                callback.call(null, null, data)
            }
        }).catch(function (e) {
            callback.call(null, e, null, file)
        })
    } else {
        patchTemplate(file, env).then(function (data) {
            if(data.code === 4004){
                callback.call(null, data.msg, null, file)
            }else{
                callback.call(null, null, data)
            }
        }).catch(function (e) {
            callback.call(null, e, null, file)
        })
    }
}

Client.prototype.fetchRemoteDirectory = function (direcory) {
    var url = config.leon.fetchDirectoryAddress
    return fetch(`${url}?userToken=${token()}&folderId=${direcory}&pId=${pId}`).then(function (res) {
        return res.json()
    })
}

Client.prototype.createRemoteDirectory = function (direcory, parentDirectoryId) {
    var url = config.leon.createDirectoryAddress
    var form = new FormData()
    form.append('folderName', direcory)
    form.append('parentFolderId', parentDirectoryId)
    return fetch(`${url}?userToken=${token()}&pId=${pId}`, {
        method: 'put',
        body: form
    }).then(function (res) {
        return res.json()
    })
}


function putTemplate(file, env, isText) {
    var url = config.leon.putTemplateAddress + '?userToken=' + token() + '&pId=' + pId
    var form = new FormData();
    form.append('templateName', file.name)
    form.append('tplDesc', file.desc)
    form.append('tplType', file.type)
    form.append('folderId', file.folderId)
    // form.append('tag', '')
    form.append('httpHeader', '{"reqMethod": "GET", "respContentType": ' + (isText ? '"text/plain"' : '"text/html"') + ',"reqContentType": "无"}')
    form.append('templateContent', getFileContent(file))
    form.append('tplContentEnv', env)
    form.append('commitMsg', 'auto commit')
    return fetch(url, {
        method: 'put',
        body: form
    }).then(function (res) {
        return res.json()
    })
}

function patchTemplate(file, env) {
    var url = config.leon.patchTemplateAddress + '?userToken=' + token() + '&pId=' + pId
    var form = new FormData()
    form.append('tplId', file.id)
    form.append('templateContent', getFileContent(file))
    form.append('tplContentEnv', env)
    form.append('commitMsg', 'auto commit')
    return fetch(url, {
        method: 'post',
        body: form
    }).then(function (res) { return res.json() }).then(function(data){
        return data
    })
}


function getFileContent(file) {
    var content = fs.readFileSync(file.file).toString()
    content.replace(/\{\{#\s*def\.(\w+)\s*\}\}/g, function (_, id) {
        return path.dirname(file.subpath).replace(/\\/g, '_') + '_views_' + id
    })
    return content
}

function token() {
    // return utils.md5(config.leon.username + config.leon.password, 0)
    return '1206456938e97c9e25530b0b68f46748'
}
module.exports = new Client()