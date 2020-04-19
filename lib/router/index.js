var path = require('path')
var express = require('express')
var routes = require('./routes')
var router = express.Router()

function resolveTemplate(template){
  return path.resolve('.temp/pages', template)
}

routes.forEach(function(route){
  var address = route.address
  var method = route.method || "get"
  var template = route.template 
  router[method](address, function(req, res){
    res.render(resolveTemplate(template), {params: params(req)})
  })
})

function params(req){
  var routeUrl = req.url
  var routePath = req.route.path
  var ret = {}
  var _params = routeUrl.match(routePath) || []
  _params.forEach(function(val, idx){
    ret['$' + idx] = val
  })

  return ret
}
router.get('/', function(req, res){
  res.render('./index.html', {entries: routes})
})

module.exports = router

