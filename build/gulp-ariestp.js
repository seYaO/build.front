'use strict';

var path = require('path')
var through = require('through2')
var aries = require('ariestp')
var PluginError = require('gulp-util').PluginError

require('./precompile')(aries)

module.exports = function gulpAries(options) {
  var opts = Object.assign({}, options)
  var ariesOptions = aries.set(options)

  return through.obj(function compileAries(file, enc, cb) {
    if (file.isBuffer()) {
      try {
        var contents = file.contents.toString()
        aries.precompile(contents, ariesOptions, function(err, data){
          file.contents = new Buffer(data)
        })
      } catch (e) {
        return cb(new PluginError('gulp-ariestp', e))
      }
    }
    cb(null, file)
  })
}