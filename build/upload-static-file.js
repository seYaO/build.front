/**
 * @author 王莉(wl09720@ly.com)
 * @module 上传
 * @exports
 * @desc 静态文件
 */

let fs = require('fs');
let path = require('path');
let glob = require('glob');
let Bagpipe = require('bagpipe')
let fetch = require('node-fetch');
let FormData = require('form-data');
let gutil = require('gulp-util');

let config = require('../config');
let log = gutil.log;
let colors = gutil.colors;

let obj = {
    // 上传静态资源  狮子座1.0
    uploadFile1(file, callback) {
        let pId = config.pId;
        var url = config.leon.uploadfileAddress
        var subpath = path.relative('output/static', file).replace(/\\/g, '/')
        var form = new FormData();
        form.append('userToken', config.userToken);
        form.append('pId', pId)
        form.append('bucketName', config.bucket);
        form.append('key', subpath);
        form.append('file', fs.readFileSync(file).toString('base64'));

        return fetch(url, {
            method: 'put',
            body: form
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            callback.call(null, null, data);
        }).catch(function (e) {
            callback.call(null, new Error(subpath + ' upload error'));
        })
    },
    // 上传静态资源   狮子座3.0
    uploadFile2(file, callback) {
        let reg = /(.*?)[0-9a-zA-Z-\.]*?\.(css|js|jpg|jpeg|png|bmp|webp|gif|map)$/
        let url = config.leon.uploadfileAddress
        let subpath = path.relative('output/static', file).replace(/\\/g, '/');
        subpath = `/${subpath.replace(reg, '$1')}`;
        let headers = {
            'user-token': config['user-token'],
            'asset-key': config['asset-key']
        }
        // let headers = {
        //     'user-token': '40147dbaf5a57074bdbe819ecb702265',
        //     'asset-key': 'e7d7b3f87f1ec169513a7bdf2ec8973e'
        // }
        var form = new FormData();
        form.append('bucket_name', config.bucket);
        form.append('key', subpath);
        form.append('file', fs.createReadStream(file));

        return fetch(url, {
            method: 'post',
            headers: headers,
            body: form
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            callback.call(null, null, data);
        }).catch(function (e) {
            callback.call(null, new Error(subpath + ' upload error'));
        })
    },
    uploadFile(file, callback) {
        obj.uploadFile2(file, callback);
    },
    // 部署静态资源
    deployAssets() {
        return new Promise((resolve, reject) => {
            glob("output/static/**", {
                nodir: true
            }, (er, files) => {
                let bagpipe = new Bagpipe(100);
                let total = files.length;
                let failed = [];
                files.forEach(file => {
                    bagpipe.push(obj.uploadFile, file, (err, data) => {
                        // remain--;
                        if (err || data.code !== 0) {
                            failed.push(err.toString());
                        }
                        if (bagpipe.active === 0) {
                            log(colors.green('静态资源上传成功'))
                            resolve('静态资源上传成功')
                        }
                    })
                })
            })
        })
    }
}



module.exports = async() => {
    try {
        log('开始处理上传...')
        await obj.deployAssets();
    } catch (err) {
        err.message += `\n 上传失败，请重新上传一次...`;
        log(err);
    }
}