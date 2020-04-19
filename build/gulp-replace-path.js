var through = require('through2')
var path = require('path')
var url = require('url')
var utils = require('./utils')
var _ = require('lodash')

function isAbsolute(uri) {
  return /^(http|https|\/\/)/.test(uri)
}

var urlReg = /url\s*\((['"]?)(.*?)\1\)/g
function replaceUrl(str, file, opts) {
  var dirname = file.dirname
  return str.replace(urlReg, function (match, quote, uri) {
    if(isAbsolute(uri)){
      return match
    }
    var _uri = uri
    var fullpath = uri.charAt(0) !== '.' && opts.root
      ? path.resolve(path.join(opts.root, uri))
      : utils.uri(uri, dirname)
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

var source = 'js|css|jpg|png|gif|jpeg|webp|bmp'
var tagReg = new RegExp('<(img|link|source|input)\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi')
var closeTagReg = new RegExp('<(script|iframe|frame|audio|video|object)\\s*[\\s\\S]*?>[\\s\\S]*?<\\/(script|iframe|frame|audio|video|object)>', 'gi')
var srcQuoteReg = new RegExp('(?=[\'"]?)([\\w\\.\\-\\?\\-\\/\\:]+?(\\.(' + source + ')))(?=[\'"]?)', 'gim')

function replaceHrefAndSrc(str, file, opts) {
  var tagList = [].concat(str.match(tagReg) || []).concat(str.match(closeTagReg) || [])
  var links = []
  var content = str
  tagList.filter(function (tag) {
    return tag.match(srcQuoteReg)
  }).forEach(function (v) {
    v && (links = links.concat(v.match(srcQuoteReg)))
  })
  /*.filter(function (uri) {
    return !isAbsolute(uri)
  })*/
  links = links.filter(function(uri){
    return uri && !isAbsolute(uri)
  })
  //.forEach(function (uri) {
    // content = content.replace(uri, function () {
    //   var dirname = file.dirname
    //   var _uri = uri
    //   var fullpath = uri.charAt(0) !== '.' && opts.root
    //     ? path.resolve(path.join(opts.root, uri))
    //     : utils.uri(uri, dirname)
    //   if (opts.root) {
    //     _uri = path.relative(opts.root, fullpath).replace(/\\/g, '/')
    //   }
    //   if (opts.manifest) {
    //     _uri = opts.manifest[_uri] || _uri
    //   }
    //   if (opts.publicPath) {
    //     _uri = url.resolve(opts.publicPath(path.extname(_uri)), _uri)
    //   }
    //   return _uri
    // })
  //})
  _.uniq(links).forEach(function(uri){
    var uriReg = new RegExp('(?=[\'"]?)('+ uri +')(?=[\'"]?)', 'gm')
    content = content.replace(uriReg, function () {
      var dirname = file.dirname
      var _uri = uri
      var fullpath = uri.charAt(0) !== '.' && opts.root
        ? path.resolve(path.join(opts.root, uri))
        : utils.uri(uri, dirname)
      if (opts.root) {
        _uri = path.relative(opts.root, fullpath).replace(/\\/g, '/')
      }
      if (opts.manifest) {
        _uri = opts.manifest[_uri] || _uri
      }
      if (opts.publicPath) {
        _uri = url.resolve(opts.publicPath(path.extname(_uri)), _uri)
      }
      return _uri
    })
  })
  return content
}

function plugin(options) {
  var opts = Object.assign({}, options)
  return through.obj(function (file, enc, cb) {
    var filename = file.path
    if (file.isBuffer()) {
      var contents = file.contents.toString()
      var ext = path.extname(filename)
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
      var contents = file.contents.toString()
      var manifest = plugin._manifest || (plugin._manifest = {})
      var json = JSON.parse(contents)
      Object.assign(manifest, json)
      file.contents = new Buffer(JSON.stringify(manifest))
    }
    cb(null, file)
  })
}

module.exports = plugin