var fs = require('fs')
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var fis = require('fis3')
var fetch = require('node-fetch')

function diff(table1, table2) {
    var ret = {}
    Object.keys(table1).forEach(function(filepath) {
        if (table2[filepath] === table1[filepath]) {
            return
        }
        ret[filepath] = table1[filepath]
    })
    return ret
}

module.exports = function(nodeEnv) {
    var outPath = config.build.outPath
    // var hashTable = {}
    // var md5Obj = {}
    // try {
    //     hashTable = JSON.parse(fs.readFileSync('./.hashconfig'))
    // } catch (e) { }

    // utils.getResource(outPath, true)
    //     // .filter(file => /\.html?$/.test(file.filename))
    //     .forEach(function(file) {
    //         md5Obj[file.path] = utils.md5(fs.readFileSync(file.path), 0)
    //     })
    // var diffs = diff(md5Obj, hashTable)
    // fis.util.write('./.hashconfig', JSON.stringify(md5Obj))
    // Object.keys(diffs).forEach(function(key) {
    //     var _path = key.replace('\\sites\\', '\\_sites\\')
    //     fis.util.write(_path, fs.readFileSync(key))
    // })
    // var _sitesDir = path.join(outPath, '_sites')
    // if(!fs.existsSync(_sitesDir)){
    //     fis.util.mkdir(_sitesDir)
    // }
    
    var key = nodeEnv === 'testing' ? 'dj_front_pc_qa' : 'dj_front_pc_prod';
    var url = `http://wx.17u.cn/intervacation/redis?key=${key}&type=get`;
    fetch(url).then(function(res){
        return res.json()
    }).then(function(hashTable){
        var md5Obj = {}
        utils.getResource(outPath, true).forEach(function(file) {
            md5Obj[file.path] = utils.md5(fs.readFileSync(file.path), 0)
        })
        var diffs = diff(md5Obj, hashTable)
        fis.util.write('./.hashconfig', JSON.stringify(md5Obj))
        Object.keys(diffs).forEach(function(key) {
            var _path = key.replace('\\sites\\', '\\_sites\\')
            fis.util.write(_path, fs.readFileSync(key))
        })
        var _sitesDir = path.join(outPath, '_sites')
        if(!fs.existsSync(_sitesDir)){
            fis.util.mkdir(_sitesDir)
        }
    })
}