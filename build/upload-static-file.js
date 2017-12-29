/**
 * 上传静态文件资源
 */
'use strict'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
// const Promise = require('promise')
const Bagpipe = require('bagpipe')
const fetch = require('node-fetch')
const FormData = require('form-data')
const version = require('../version')[0]
const config = require('../config/upload.config')

/**
 * 上传静态资源
 * @param {*} file 
 * @param {*} callback 
 */
function uploadFile(file, callback) {
    console.log(file)
    let reg = /(.*?)[0-9a-zA-Z-\.]*?\.(css|js|jpg|jpeg|png|bmp|webp|gif|map)$/
    let url = config.uploadfileAddress;
    let subpath = path.relative('dist', file).replace(/\\/g, '/');
    subpath = `/${subpath.replace(reg, '$1')}`;
    let headers = {
        'user-token': config['user-token'],
        'asset-key': config['asset-key']
    }
    let form = new FormData();
    form.append('bucket_name', config.bucketName);
    form.append('key', config.projectName + subpath);
    form.append('file', fs.createReadStream(file));

    return fetch(url, {
        method: 'post',
        headers: headers,
        body: form
    }).then(function (res) {
        if (res.status == 200) {
            return res.json();
        } else {
            console.log(res.status)
            return res.json();
        }

    }).then(function (data) {
        callback.call(null, null, data);
    }).catch(function (e) {
        callback.call(null, new Error(file + ' upload error'));
    })
}

/**
 * 部署静态资源
 */
function deployAssets() {
    return new Promise((res, rej) => {
        glob(`dist/${version}/**`, { nodir: true }, (error, files) => {
            const bagpipe = new Bagpipe(50);
            let failed = [];
            files.forEach(file => {
                bagpipe.push(uploadFile, file, (err, data) => {
                    if (err || data.code !== 0) {
                        failed.push(err.toString())
                    }
                    if (bagpipe.active === 0) {
                        if (failed && failed[0]) {
                            rej(failed)
                        } else {
                            res('静态资源上传成功')
                        }
                    }
                })
            });
        })
    })
}

// 部署静态资源
module.exports = async() => {
    try{
        console.log('开始处理上传...')
        let tip = await deployAssets();
        console.log(tip);
    }catch(err){
        err.message += `\n 上传失败，请重新上传一次...`;
        console.log(err)
    }
}