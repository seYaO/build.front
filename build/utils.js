var fs = require('fs')
var path = require('path')
var archiver = require('archiver')
var crypto = require('crypto')
var Promise = require('promise')
var gutil = require('gulp-util')

var _exists = fs.existsSync || path.existsSync
var IS_WIN = process.platform.indexOf('win') === 0;
var APPDATA =  process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
var _ = module.exports = {}

_.uri = function (_path, dirname) {
  return path.resolve(dirname || '', _path)
}

_.isDir = function (_path) {
  return _exists(_path) && fs.statSync(_path).isDirectory();
}

_.isAbsolute = function (_path) {
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
}

function extFactory(exts) {
  return function (ext) {
    return exts.split('|').map(function (_ext) { return '.' + _ext }).indexOf(ext) > -1
  }
}
var cssExt = 'css|sass|scss|less'
_.isCSSLike = extFactory(cssExt)

var imgExt = 'jpg|jpeg|png|bmp|webp|gif'
_.isIMGLike = extFactory(imgExt)

var jsExt = 'js|jsx|es'
_.isJSLike = extFactory(jsExt)

var htmlExt = 'html|htm|tpl'
_.isHTMLLike = extFactory(htmlExt)

_.zipDir = function (inDirname, outFilename) {
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
}

_.md5 = function (data, len) {
  var md5sum = crypto.createHash('md5'),
    encoding = typeof data === 'string' ? 'utf8' : 'binary';
  md5sum.update(data, encoding);
  if (len === 0) {
    return md5sum.digest('hex')
  }
  len = len || 7;

  return md5sum.digest('hex').substring(0, len);
}

_.log = gutil.log

_.requireGlobal = function(mod){
  return require(path.join(APPDATA, 'npm/node_modules', mod))
}