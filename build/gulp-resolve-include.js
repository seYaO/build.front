'use strict';

var path = require('path')
var through = require('through2')
var PluginError = require('gulp-util').PluginError

module.exports = function (options) {
  var opts = Object.assign({}, options)
  var includeReg = /<%\s+includeId\s*\*=\s*([^%]+)%>/g
  return through.obj(function compileAries(file, enc, cb) {
    if (file.isBuffer()) {
      try {
        var contents = file.contents.toString()
        contents = contents.replace(includeReg, '<% includeId = $1%>')
        file.contents = new Buffer(contents)
      } catch (e) {
        return cb(new PluginError('gulp-ariestp', e))
      }
    }
    cb(null, file)
  })
}