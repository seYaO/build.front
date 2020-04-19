var path = require('path')
var _ = fis.util._
module.exports = function (ret, pack, settings, opt) {
    var src = ret.src
    var idmapping = ret.idmapping
    var files = Object.keys(src)
        .filter(subpath => src[subpath].isHtmlLike && subpath.startsWith('/sites'))
        .map(subpath => {
            src[subpath]._site = subpath.split('/')[2]
            return src[subpath]
        })
    var sites = _.groupBy(files, file => file._site)

    var sitesMap = {}
    Object.keys(sites).forEach(name => {
        var pages = sites[name]
        var deps = pages.map(page => {
            var deps = iterateDep(null, page, idmapping, ret)
            return {
                [page.id]: deps
            }
        })
        sitesMap[name] = deps
    })

    Object.keys(src).filter(subpath => {
        return src[subpath].basename === 'maintain.json'
    }).forEach((subpath) => {
        var file = src[subpath]
        Object.keys(sitesMap).forEach(site => {
            if (file.subdirname.indexOf(site) > -1) {
                file.setContent(JSON.stringify(sitesMap[site]))
            }
        })
    })
}

function iterateDep(ret, file, idmapping) {
    var deps = file.map ? file.map.deps : null
    ret || (ret = {})
    if (deps) {
        deps.forEach((dep) => {
            if (idmapping[dep]) {
                // console.log(idmapping[dep].map.uri)
                Object.assign(ret, { [idmapping[dep].didep]: idmapping[dep].map.uri })
                iterateDep(ret, idmapping[dep], idmapping)
            }

        })
    }
    return ret
}