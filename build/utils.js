/**
 * @author 王莉(wl09720@ly.com)
 * @module util
 * @exports
 * @desc 工具
 */

let fs = require('fs'),
    path = require('path'),
    archiver = require('archiver'),
    crypto = require('crypto'),
    gutil = require('gulp-util');




let _exists = fs.existsSync || path.existsSync;
let IS_WIN = process.platform.indexOf('win') === 0;
let APPDATA = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
let exts = {
    cssExt: 'css|sass|scss|less',
    imgExt: 'jpg|jpeg|png|bmp|webp|gif',
    jsExt: 'js|jsx|es',
    htmlExt: 'html|htm|tpl|ftl'
}
let utils = {
    uri(_path, dirname) {
        return path.resolve(dirname || '', _path);
    },
    isDir(_path) {
        return _exists(_path) && fs.statSync(_path).isDirectory();
    },
    isAbsolute(_path) {
        if (IS_WIN) {
            return /^[a-z]:/i.test(_path);
        } else {
            if (_path === '/') {
                return true;
            } else {
                var split = _path.split('/');
                if (split[0] === '~') {
                    return true;
                } else if (split[0] === '' && split[1]) {
                    return _.isDir('/' + split[1] + '/' + split[2]);
                } else {
                    return false;
                }
            }
        }
    },
    zipDir(inDirname, outFilename) {
        let output = fs.createWriteStream(outFilename);
        let archive = archiver('zip');

        return new Promise(function (resolve, reject) {
            archive.pipe(output);
            archive.directory(inDirname, "");
            archive.finalize();

            archive.on("finish", function () {
                return resolve(output);
            })
            archive.on('error', function (err) {
                return reject(err);
            });

        });
    },
    // md5加密
    md5(data, len) {
        var md5sum = crypto.createHash('md5'),
            encoding = typeof data === 'string' ? 'utf8' : 'binary';
        md5sum.update(data, encoding);
        if (len === 0) {
            return md5sum.digest('hex')
        }
        len = len || 7;

        return md5sum.digest('hex').substring(0, len);
    },
    isCSSLike: extFactory(exts.cssExt),
    isIMGLike: extFactory(exts.imgExt),
    isJSLike: extFactory(exts.jsExt),
    isHTMLLike: extFactory(exts.htmlExt),
    log: gutil.log,
    requireGlobal(mod) {
        return require(path.join(APPDATA, 'npm/node_modules', mod))
    }
};

function extFactory(exts) {
    return function (ext) {
        return exts.split('|').map(function (_ext) {
            return '.' + _ext
        }).indexOf(ext) > -1
    }
}

module.exports = utils;