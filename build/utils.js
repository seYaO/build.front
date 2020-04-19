'use strict'
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var dot = require('dot')
var fetch = require('node-fetch')
var Promise = require('promise')
var archiver = require('archiver')
var config = require('../config')

const IS_WIN = process.platform.indexOf('win') === 0

module.exports = {
    getResource(rootPath, deep) {
        var result = []
        deep === undefined && (deep = true)
        function loop(_path) {
            var names = fs.readdirSync(_path);

            names.forEach(function (name) {
                var filepath = path.join(_path, name)
                if (fs.statSync(filepath).isDirectory() && deep) {
                    loop(filepath)
                } else {
                    result.push({
                        filename: name,
                        path: filepath
                    })
                }
            })
        }
        loop(rootPath)
        return result
    },
    getJSON: function (url, method) {
        return fetch(url, {
            method: method || "get"
        }).then(function (res) {
            return res.json()
        }).then(function (json) {
            return json
        })
    },
    readFile: function (file) {
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (err, data) {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(data)
                }
            })
        })
    },
    zipDir: function (inDirname, outFilename) {
        var output = fs.createWriteStream(outFilename)
        var archive = archiver('zip')

        return new Promise(function (resolve, reject) {
            archive.pipe(output);
            archive.directory(inDirname, "");
            archive.finalize();

            archive.on("finish", function () {
                return resolve(output)
            })
            archive.on('error', function (err) {
                return reject(err)
            });

        })
    },
    isAbsolute: function (pth) {
        if (IS_WIN) {
            return /^[a-z]:/i.test(pth);
        } else {
            if (pth === '/') {
                return true;
            } else {
                var split = pth.split('/');
                if (split[0] === '~') {
                    return true;
                } else if (split[0] === '' && split[1]) {
                    return fs.statSync('/' + split[1] + '/' + split[2]).isDirectory();
                } else {
                    return false;
                }
            }
        }
    },
    // 获取完整的路径
    // 不要关注性能
    getFullPath: function (name) {
        var projectRoot = path.join(__dirname, '../')
        var workspaceRoot = path.join(projectRoot, config.build.workspaceRoot)
        var pageRoot = path.join(workspaceRoot, config.build.pageRoot)
        var outPath = path.join(projectRoot, config.build.outPath)

        var pathObj = {
            projectRoot: projectRoot,
            workspaceRoot: workspaceRoot,
            pageRoot: pageRoot,
            outPath: outPath
        }

        return pathObj[name]
    },
    // 还是那句话不要在乎性能
    isEqual: function (obj1, obj2) {
        var keys = []
        for (let key in obj1) {
            if (obj1[key] === obj2[key]) {
                keys.push(key)
            } else {
                return false
            }
        }
        for (let key in obj2) {
            if (keys.indexOf(key) === -1) {
                return false
            }
        }
        return true
    },
    md5: function (data, len) {
        var md5sum = crypto.createHash('md5'),
            encoding = typeof data === 'string' ? 'utf8' : 'binary';
        md5sum.update(data, encoding);
        if(len === 0){
            return md5sum.digest('hex')
        }
        len = len || 7;
        
        return md5sum.digest('hex').substring(0, len);
    }
}