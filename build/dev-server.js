var fs = require("fs")
var path = require('path')
var http = require("http")
var aries = require("ariestp")
var glob = require('glob')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var proxyMiddleware = require('http-proxy-middleware')
var router = require('../lib/router')

var port = process.env.PORT || 3010
var app = express()
aries.set({
  includeId: function(templateId, ctx, cb){
    var tmplId = getRealTemplateId(templateId)
//  var filename = ctx.filename
    return fs.readFile(path.join(__dirname, '../.temp/templates', tmplId + '.html'), cb)
  },
  path: './.temp/templates'
})
app.engine('html', aries.compileFile)
app.set('views', './')

var proxyTable = require('../lib/proxy') || {}
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./ariestpMiddleware')(app))
app.use(require('./livereloadMiddleware')({port: 35730}))
app.use(express.static(path.join(__dirname, '../dest/public')))
app.use(router)
// var _routes = routes()
// _routes.forEach(function(route){
//   var address = route.address
//   var options = {filename: route.filename}
//   if(address === '/index'){
//     address = '/'
//     options = {entries: _routes}
//   }
//   app.get(address, function(req, res){
//     return res.render(route.filename, options)
//   })
// })

function getRealTemplateId(fadeId){
  var ret = /=\s+([^?]+)/.exec(fadeId)
  if(!ret && fadeId){
    throw new Error(`语法错误：无法解析 ${fadeId}`)
  }else{
    return ret[1]
  }
}

function getPages(){
  return glob.sync('./.temp/pages/**/*.html')
}

function path2address(filepath){
  return '/' + filepath.substring(0, filepath.length - 5).replace(/\\/, '/')
}

function routes(){
  var pages = getPages()
  return pages.map(function(page){
    var address = path2address(path.relative('./.temp/pages', page))
    return {
      address: address,
      filename: page,
      control: null
    }
  })
}

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})