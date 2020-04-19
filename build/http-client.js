var fs = require('fs')
var path = require('path')
var fetch = require('node-fetch')
var FormData = require('form-data')
var config = require('../config')
var utils = require('./utils')
var Promise = require('promise')
var glob = require('glob')
var Bagpipe = require('bagpipe')
var qs = require('querystring')

// var pId = config.pId
// var TMPL_ENV = process.env._TMPL_ENV || 'testing'

// 上传静态资源
exports.uploadFile = function (file, callback) {
    var pId = process.env._TMPL_ENV === 'offlinetesting' ? '57b5529b79bf6c8767e4c184' : '57aacb25eb710abdd971c1d6'
    var url = config.leon.uploadfileAddress
    var subpath = path.relative('dest/public', file).replace(/\\/g, '/')
    var form = new FormData();
    form.append('userToken', token());
    form.append('pId', pId)
    form.append('bucketName', config.bucket);
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
exports.uploadTemplate = function (file, type, env, isText, callback) {
    if (type === 'put') {
        putTemplate(file, env, isText).then(function (data) {
            callback.call(null, null, data)
        }).catch(function (e) {
            callback.call(null, e)
        })
    } else {
        patchTemplate(file, env).then(function (data) {
            callback.call(null, null, data)
        }).catch(function (e) {
            callback.call(null, e)
        })
    }
}

exports.fetchRemoteDirectory = function (direcory) {
    var pId = process.env._TMPL_ENV === 'offlinetesting' ? '57b5529b79bf6c8767e4c184' : config.pId
    var url = leonUrl('fetchDirectoryAddress')
    return fetch(`${url}?userToken=${token()}&folderId=${direcory}&pId=${pId}`).then(function (res) {
        return res.json()
    }).then(function(data){
        if(data.code !== 0){
            throw new Error(data.msg)
        }
        return data
    })
}

exports.createRemoteDirectory = function (direcory, parentDirectoryId) {
    var pId = process.env._TMPL_ENV === 'offlinetesting' ? '57b5529b79bf6c8767e4c184' : config.pId
    var url = leonUrl('createDirectoryAddress')
    var form = new FormData()
    form.append('folderName', direcory)
    form.append('parentFolderId', parentDirectoryId)
    return fetch(`${url}?userToken=${token()}&pId=${pId}`, {
        method: 'put',
        body: form
    }).then(function (res) {
        return res.json()
    }).then(function (data) {
        return { name: direcory, id: data.msg }
    })
}

function putTemplate(file, env, isText) {
    var pId = process.env._TMPL_ENV === 'offlinetesting' ? '57b5529b79bf6c8767e4c184' : config.pId
    var url = leonUrl('putTemplateAddress') + '?userToken=' + token() + '&pId=' + pId
    var form = new FormData();
    form.append('templateName', file.name)
    form.append('tplDesc', file.desc)
    form.append('tplType', file.type)
    form.append('folderId', file.folderId)
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
    var pId = process.env._TMPL_ENV === 'offlinetesting' ? '57b5529b79bf6c8767e4c184' : config.pId
    var url = leonUrl('patchTemplateAddress') + '?userToken=' + token() + '&pId=' + pId
    var form = new FormData()
    form.append('tplId', file.id)
    form.append('templateContent', getFileContent(file))
    form.append('tplContentEnv', env)
    form.append('commitMsg', 'auto commit')
    return fetch(url, {
        method: 'post',
        body: form
    }).then(function (res) {
        return res.json()
    }).then(function (data) {
        return data
    })
}

function getFileContent(file) {
    var content = fs.readFileSync(file.file).toString()
    // content.replace(/\{\{#\s*def\.(\w+)\s*\}\}/g, function (_, id) {
    //     return path.dirname(file.subpath).replace(/\\/g, '_') + '_views_' + id
    // })
    return content
}

var _token = null
function token() {
    var TMPL_ENV = process.env._TMPL_ENV || 'testing'
    _token || (_token = JSON.parse(fs.readFileSync('./.config'))[TMPL_ENV].token)
    return _token
}

function leonUrl(method){
    var TMPL_ENV = process.env._TMPL_ENV || 'testing'
  return (TMPL_ENV === 'offlinetesting' ? 'http://10.5.20.3:6601' : 'http://leonidapi.17usoft.com') + config.leon[method]
}

var redisUrl = 'http://wx.t.17u.cn/intervacation/redis'
exports.setConf = function (option) {
    option = Object.assign({
        url: redisUrl,
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

exports.getConf = function (option) {
    option = Object.assign({
        url: redisUrl,
        type: 'get',
        key: ''
    }, option)

    return fetch(option.url + `?key=${option.key}&type=get`).then((res) => { return res.text() })
}