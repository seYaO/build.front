/**
 * 1. 检查 node 和 npm 的版本
 * 2. 相关插件和配置
 * 3. 创建 express 服务器和 webpack 编译器
 * 4. 配置开发中间件（webpack-dev-middleware）和热重载中间件（webpack-hot-middleware）
 * 5. 挂载代理服务和中间件
 * 6. 配置静态资源
 * 7. 启动服务器监听特定端口 8080
 * 8. 自动打开浏览器并打开特定网址 localhost:8080
 */

'use strict'
// 检查 nodejs 和 npm 的版本
require('./check-versions')()

// 获取配置
const config = require('../config')
// 如果 node 的环境变量中没有设置当前的环境 (NODE_ENV)，则使用 config 中的配置作为当前的环境
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
// 一个可以调用默认软件打开网址、图片、文件等内容的插件
// 这里用它来调用默认浏览器打开 dev-server 监听的端口，例：localhost:8080
const opn = require('opn')
const path = require('path')
const glob = require('glob');
const express = require('express')
const webpack = require('webpack')
// 一个 express 中间件，用于将 http 请求代理到其他服务器
// 例：localhost:8080/api/xxx  --->   localhost:3000/api/xxx
// 这里使用该插件可以将前端开发中涉及到的请求代理到 API 服务器上，方便与服务器对接
const proxyMiddleware = require('http-proxy-middleware')
const fs = require('fs')
// 根据 node 环境来引入相应的 webpack 配置
const webpackConfig = process.env.NODE_ENV === 'testing' ? require('./webpack.prod.conf') : require('./webpack.dev.conf')
const { apiPrefix } = require('../src/utils/config')
const ip = require('./get-ip-Adress')()
// default port where dev server listens for incoming traffic
// dev-server 监听的端口，默认为 config.dev.port 设置的端口，即8080
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
// 用于判断是否要自动打开浏览器的布尔变量，当配置文件中没有设置自动打开浏览器的时候其值为 false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 定义 http 代理表，代理到 API服务器
const proxyTable = config.dev.proxyTable

// 创建1个 express 实例
const app = express()
// 根据 webpack 配置文件创建 Compiler 对象
const compiler = webpack(webpackConfig)

// let routeArr = []
// const fileName = 'views'
// //从config.json中读取api数组
// const files = glob.sync(`./src/${fileName}/**/config.json`);
// files.map((file) => {
//     const fileBuffer = fs.readFileSync(file);
//     if(fileBuffer) {
//         let data = fileBuffer.toString();
//         let parseData = data && JSON.parse(data) || {};
//         if(!!parseData && !!parseData.api && !!parseData.api.length){
//             routeArr = routeArr.concat(parseData.api)
//         }
//     }
// })

// //配置路由
// routeArr.map(function(apiElem){
//     if(apiElem.type.toLowerCase() == 'get'){
//         app.get(apiPrefix + apiElem.route,function(req,res){
//             res.sendFile(path.resolve(__dirname, '../api/'+apiElem.file+'.json'))
//         });
//     } else {
//         app.post(apiPrefix + apiElem.route,function(req,res){
//             res.sendFile(path.resolve(__dirname, '../api/'+apiElem.file+'.json'))
//         });
//     }
// })



// webpack-dev-middleware 使用 compiler 对象来对相应的文件进行编译和绑定
// 编译绑定后将得到的产物存放在内存中而没有写进磁盘
// 将这个中间件交给 express 使用之后即可访问这些编译后的产品文件
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// webpack-hot-middleware 用于实现热重载功能的中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// 当 html-webpack-plugin 提交之后通过热重载中间件发布重载动作使得页面重载
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
// 将热重载中间件挂在到 express 服务器上
app.use(hotMiddleware)

// proxy api requests
// 将 proxyTable 中的代理请求配置挂在到 express 服务器上
Object.keys(proxyTable).forEach(function (context) {
  const options = proxyTable[context]
  // 格式化 options 
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 重定向不存在的 URL，常用于 SPA
app.use(require('connect-history-api-fallback')())

// serve webpack bundle outputSPA
// 使用 webpack 开发中间件
// 即将 webpack 编译后输出到内存中的文件资源挂到 express 服务器上
app.use(devMiddleware)

// serve pure static assets
// 静态资源的路径
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 将静态资源挂到 express 服务器上
app.use(staticPath, express.static('./static'))

// 应用的地址信息，例：http://localhost:8080
const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
// webpack 开发中间件合法 (valid) 之后输出提示语到控制台，表明服务器已启动
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = `http://${ip}:${port}`
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    // 如果符合自动打开浏览器的条件，则通过 opn 插件调用系统默认浏览器打开对应的地址 uri
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    // 启动 express 服务器并监听相应的端口 8080
    server = app.listen(port)
    _resolve()
  })
})



module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
