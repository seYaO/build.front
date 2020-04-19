var fs = require('fs')
var Url = require('url')
var qs = require('querystring')
var path = require('path')
// var doT = require('doT')
// var co = require('co')
var express = require('express')
var Promise = require('promise')
var fetch = require('node-fetch')
var proxyMiddleware = require('http-proxy-middleware')
var utils = require('./utils')
var config = require('../config')
var proxyTable = require('../proxy-table')

var port = process.env.PORT || config.dev.port
var app = express()

app.engine("html", require('./dot').__express);
app.set('view engine', 'html');
app.set('views', './')

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
})

// routes
var routes = getRoutes()
var entries = Object.keys(routes).map(function (key) {
    var route = routes[key]
    return {
        uri: route.route,
        title: (route.config.desc || '') + '[' + route.route + ']'
    }
})

app.get('/', function (req, res) {
    res.render('index', { entries: entries,  resolveDot: true})
})

Object.keys(routes).forEach(function(key){
    var route = routes[key]
    var routeConfig = route.config
    var filename = route.filename

    app.get(route.route, function (req, res) {
        var dataTask
        if (routeConfig.dataUri) {
            var url = Url.parse(routeConfig.dataUri)
            var query = Object.assign({}, qs.parse(url.query), routeConfig.query, req.query)
            var dataUri = Url.format({ pathname: url.pathname, query: query })
            var method = routeConfig.method
            // 如果配置里的query 和请求的query不一致
            if (!utils.isEqual(req.query, query)) {
                return res.redirect(route.route + '?' + qs.stringify(query))
            }

            if (req.query.__env__) {
                process.env.WEBAPI_ENV = req.query.__env__
            }
            var env = process.env.WEBAPI_ENV
            var webApiHost = config[env].webApiHost
            if (/post/i.test(method)) {
                dataTask = fetch(webApiHost + routeConfig.dataUri, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: qs.stringify(routeConfig.body)
                }).then(function(res) {
                    return res.json()
                }).then(function(json) {
                    return json
                })
            } else {
                dataTask = getJSON(dataUri, method)
            }
        }else{
            dataTask = new Promise(function (resolve, reject) { return resolve({ Code: 4000, Data: {} }) })
        }
        dataTask.then(function(data){
            //
            if(data && data.Code && data.Code !== 4000){
                return res.end(data.Message)
            }
            // 兼容现有的逻辑
            var varname = 'it'
            var resolveDot = true
            if(/\/(dujia|wanle|poi|wanlewx|touch)\//.test(req.url)){
                varname =  'IT'
            }
            if(/\/activity\//.test(req.url)){
                resolveDot = false
            }
            
            Object.assign(data, {
                templateSettings: {
                    varname: varname
                },
                processDefPath: routeConfig.views,
                resolveDot: resolveDot
            })
            return res.render(filename, data);
        }).catch(function(e){
            return res.end(e.stack)
        })
    })

    app.get(route.route + '/:action', function (req, res) {
        switch (req.params.action) {
            case 'data':
                if (!routeConfig.dataUri) {
                    return res.end('没有同步数据')
                }
                var url = Url.parse(routeConfig.dataUri)
                var dataUri = Url.format({ pathname: url.pathname, query: Object.assign({}, qs.parse(url.query), routeConfig.query, req.query) })

                getJSON(dataUri).then(function (data) {
                    res.end(JSON.stringify({ "requestUri": dataUri, "responseData": data }))
                }); break
            default: res.end(`请求 \`/data\` 获取同步数据`)
        }
    })
})

app.use(express.static(path.join(config.build.outPath, 'static')))

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})

function getJSON(uri, method) {
    var env = process.env.WEBAPI_ENV || 'dev'
    var url = config[env].webApiHost + uri
    return utils.getJSON(url, method)
}

function getRoutes(){
    var routes = {}
    var outPath = utils.getFullPath('outPath')

    utils.getResource(outPath)
        .filter(file => /\.html?$/.test(file.filename))
.forEach((file) => {
        var route = path.relative(outPath, file.path).replace(path.extname(file.filename), '')
        var routeConfig = {}
        try {
            routeConfig = JSON.parse(fs.readFileSync(path.join(path.dirname(file.path), 'config.json')))
    } catch (e) {
        routeConfig = {}
    }

    Object.assign(routes, {
        [route]: {
            route: '/' + route.replace(/\\/g, '/'),
            filename: file.path,
            config: routeConfig
        }
    })
})
    return routes
}