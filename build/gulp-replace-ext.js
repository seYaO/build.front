var through = require('through2')
var path = require('path')
var utils = require('./utils')

var extMap = {
  css: ['less', 'scss'],
  js: ['coffee', 'jsx', 'ts']
}
module.exports = function (options) {
  var opts = Object.assign({}, extMap, options)
  // 

}
