let through = require('through2');
let path = require('path');
let url = require('url');
let utils = require('./utils');
let _ = require('lodash');

let NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

function isAbsolute(uri) {
    return /^(http|https|\/\/)/.test(uri);
}

function isBase64(uri) {
    return /^data:image\/png;base64/.test(uri);
}

let urlReg = /url\s*\((['"]?)(.*?)\1\)/g;

function replaceUrl(str, file, opts) {
    let dirname = file.dirname
    return str.replace(urlReg, function (match, quote, uri) {
        if (isAbsolute(uri)) {
            return match;
        }

        if (isBase64(uri)) {
            return match;
        }
        let _uri = uri
        let fullpath = uri.charAt(0) !== '.' && opts.root ?
            path.resolve(path.join(opts.root, uri)) :
            utils.uri(uri, dirname)
        if (opts.root) {
            _uri = path.relative(opts.root, fullpath).replace(/\\/g, '/')
        }
        if (opts.manifest) {
            _uri = opts.manifest[_uri] || _uri
        }
        if (opts.publicPath) {
            _uri = url.resolve(opts.publicPath(path.extname(_uri)), _uri)
        }
        return 'url' + '("' + _uri + '")'
    })
}

let source = 'js|css|jpg|png|gif|jpeg|webp|bmp'
let tagReg = new RegExp('<(img|link|source|input)\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi')
let closeTagReg = new RegExp('<(script|iframe|frame|audio|video|object)\\s*[\\s\\S]*?>[\\s\\S]*?<\\/(script|iframe|frame|audio|video|object)>', 'gi')
let srcQuoteReg = new RegExp('(?=[\'"]?)([\\w\\.\\-\\?\\-\\/\\:]+?(\\.(' + source + ')))(?=[\'"]?)', 'gim')

function replaceHrefAndSrc(str, file, opts) {
    let tagList = [].concat(str.match(tagReg) || []).concat(str.match(closeTagReg) || [])
    let links = []
    let content = str
    tagList.filter(function (tag) {
        if(!/js.40017.cn/.test(tag)){
            return tag.match(srcQuoteReg)
        }        
    }).forEach(function (v) {
        v && (links = links.concat(v.match(srcQuoteReg)))
    })

    links = links.filter(function (uri) {
        return uri && !isAbsolute(uri)
    })
    _.uniq(links).forEach(function (uri) {
        let uriReg = new RegExp('(?=[\'"]?)(' + uri + ')(?=[\'"]?)', 'gm')
        content = content.replace(uriReg, function () {
            let dirname = path.dirname(file.path);
            let _uri = uri
            let fullpath = uri.charAt(0) !== '.' && opts.root ?
                path.resolve(path.join(opts.root, uri)) :
                utils.uri(uri, dirname);

            if (opts.root && !/[\/\\]lib/.test(_uri)) {
                _uri = path.relative(opts.root, fullpath).replace(/\\/g, '/')
            }

            let configPath = utils.uri('config.json', dirname);
            if (opts.manifest) {
                _uri = opts.manifest[_uri] || _uri
            }
            if (opts.publicPath) {
                if (/[\/\\]lib/.test(_uri)) {
                    _uri = _uri.slice(1);
                    _uri = url.resolve(opts.publicPath(_uri), _uri);
                } else {
                    _uri = url.resolve(opts.publicPath(path.extname(_uri)), _uri)
                }
            }
            return _uri;
        })
    })
    return content
}

function plugin(options) {
    let opts = Object.assign({}, options)
    return through.obj(function (file, enc, cb) {
        let filename = file.path
        if (file.isBuffer()) {
            let contents = file.contents.toString()
            let ext = path.extname(filename)
            if (utils.isCSSLike(ext)) {
                contents = replaceUrl(contents, file, opts)
            } else if (utils.isHTMLLike(ext)) {
                contents = replaceHrefAndSrc(contents, file, opts)
            } else {
                // i dont care
            }
            file.contents = new Buffer(contents)
        }
        cb(null, file)
    })
}
// 收集 manifest
plugin.gatherManifest = function () {
    return through.obj(function (file, enc, cb) {
        if (file.isBuffer()) {
            let contents = file.contents.toString()
            let manifest = plugin._manifest || (plugin._manifest = {})
            let json = JSON.parse(contents)
            Object.assign(manifest, json)
            file.contents = new Buffer(JSON.stringify(manifest))
        }
        cb(null, file)
    })
}

module.exports = plugin