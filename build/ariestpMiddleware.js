var url = require('url')
var util = require('util')
var crypto = require('crypto')
var Buffer = require('buffer')
var querystring = require('querystring')
var moment = require('moment')
var request = require('request')
var debug = require('debug')('ctx:dsf')

function merge(to, from){
  return Object.assign(to, from)
}

function cookie(req, res){
  return {
    getCookie: function(name){
      return req.cookies[name]
    },
    setCookie: res.cookie
  }
}

function stringToJson(str){
  return JSON.parse(str)
}
// "dsf.tccruise.resource.marketingcenter.information", ctx.ConfMarketingCenterVersion, "getinfos", {"labelid":ctx.trendid,"pageindex":0,"pagesize":3 }
var qs = querystring
var dsfUrl = 'http://leonidapi.17usoft.com/djaquarius/exec'
function dsf(basename, version, method, param, callback){
  var url = dsfUrl + '?' + qs.stringify({
    basename: basename,
    method: method,
    version: version,
    param: JSON.stringify(param)
  })
  var self = this
  debug('request:', url)
  request(url, function(err, res, body){
    callback.call(this, err, body)
  })
}

module.exports = function(app){
  var locals = app.locals
  var req = app.request
  var res = app.response

  merge(locals, {
    request: request,
    urlFormat: url.format,
    urlResolve: url.resolve,
    urlParse: url.parse,
    moment: moment,
    querystring: querystring,
    util: util,
    crypto: crypto,
    Buffer: Buffer,
    dsf: dsf,
    stringToJson: stringToJson,
    redirect: res.redirect,
    setHeader: res.setHeader,
  })
  

  return function ctx(req, res, next){
    merge(locals, {
      query: req.query,
      body: req.body,
      reqUri: req.url,
      reqIPAddr: req.ip,
      reqHeader: req.headers,
      rawBody: req.rawBody,
      hostname: req.header('host'),
      // params: params
      protocol: req.protocol
    })
    merge(locals, cookie(req, res))

    next();
  };
}
