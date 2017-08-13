/**
 * @author 王莉(wl09720@ly.com)
 * @module 模版合并
 * @exports
 * @desc 将ejs子模块合并到页面中，生成为最终页
 *       将ejs语法格式转为freemarker语法格式，便于给开发
 */

'use strict';

let fs = require('fs');
let path = require('path');
let through = require('through2');
let PluginError = require('gulp-util').PluginError;

let obj = {
    // 替换页面同步数据格式
    pageStateMode(str) {
        let includeReg = /<script\s+name="text\/freemarker"\s*>[\s\S]*?<\/script>/g;
        let ret = str;

        if (includeReg.test(ret)) {
            let reg = /<%=(.*?)\s*%>/g;
            ret = ret.replace(includeReg, (...arg) => {
                let _str = arg[0];
                while (reg.test(_str)) {
                    _str = _str.replace(reg, (..._arg) => {
                        return '${' + _arg[1] + '!}';
                    })
                }
                return _str;
            });

        }

        return ret;
    },
    // 替换页面模块
    pageModule(str, options) {
        let includeReg = /<%\s+include\s+([^\s]+)\s+%>/g;
        let views = options.dirname;
        let ret = str;

        while (includeReg.test(ret)) {
            ret = ret.replace(includeReg, function (matched, name) {
                return fs.readFileSync(path.join(views, name));
            });
        }

        return ret;
    },
    // 替换公共模块
    commonModule(str) {
        let includeReg = /<%-.*?(templates\/.*?\.ftl).*?-%>/g;
        let ret = str;

        while (includeReg.test(ret)) {
            ret = ret.replace(includeReg, function (...arg) {
                return `<#include "${arg[1]}"/>`
            })
        }

        return ret;
    }
}

function precompile(str, options, callback) {
    let ret = str;

    ret = obj.pageModule(ret, options);
    ret = obj.commonModule(ret);
    ret = obj.pageStateMode(ret);

    callback(null, ret);
}



module.exports = (options) => {
    let opts = Object.assign({}, options);
    return through.obj((file, enc, callback) => {
        if (file.isBuffer) {
            try {
                Object.assign(opts, {
                    dirname: file.dirname
                });

                let contents = file.contents.toString();
                precompile(contents, opts, (err, data) => {
                    file.contents = new Buffer(data);
                })
            } catch (e) {
                return callback(new PluginError('----gulp-template-merge----', e));
            }
        }
        callback(null, file);
    });
}