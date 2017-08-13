let util = require('./build/utils');


let config = {
    build: {
        root: './src',
        port: 4000,
        'browser-sync-prot': 3000,
    },
    // 本地开发环境
    development: {
        publicPath(ext) {
            if (util.isCSSLike(ext)) {
                return '/css/';
            }
            if (util.isJSLike(ext)) {
                return '/js/';
            }
            if (util.isIMGLike(ext)) {
                return '/img/';
            }
            return '/';
        }
    },
    // 生产环境
    production: {
        publicPath(ext) {
            if (util.isCSSLike(ext)) {
                return '//test.com/test/css/';
            }
            if (util.isJSLike(ext)) {
                return '//test.com/test/s/';
            }
            if (util.isIMGLike(ext)) {
                return '//test.com/test/img/';
            }
            return '//test.com/test/';
        }
    },
    socket: '',
    pId: '', // 
    userToken: '', // 
    'user-token': '', // 
    'asset-key': '', // 
    namespace: 'bxqd',
    bucket: 'baoxian',
    leon: {
        // 上传静态文件
        // uploadfileAddress1: '',
        // 3.0 狮子座线上
        uploadfileAddress2: '',
        // 3.0 狮子座线下
        // uploadfileAddress2: ',
    }
};

module.exports = config;