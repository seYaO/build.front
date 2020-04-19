var fs = require('fs')
var doT = require('dot')
var path = require('path')
var fetch = require('node-fetch')

var exports = module.exports
var defaults = {
    templateSettings: {
        strip: false
    },
    processDefPath: './views',
    extension: 'dot',
    include: /<\%\s+includeId\s*(\*)?=\s*([^\%]+)\s+\%>/ig,
    includeUri: 'http://leonidapi.17usoft.com/sagittarius/=',
    preview: 'leonid_preview=1'
}

exports.init = function (config) {
    Object.assign(defaults, config)
    return this
}

exports.renderFile = function (filename, options, callback) {
    if (typeof options === 'function') {
        callback = options
        options = {}
    }
    if (typeof callback !== 'function') {
        callback = (function () { })
    }
    var result, template, settings, templateSettings;
    settings = {}
    templateSettings = Object.assign({}, doT.templateSettings, defaults.templateSettings, options && options.templateSettings)
    settings.templateSettings = templateSettings
    settings.processDefPath = options.processDefPath || defaults.processDefPath
    settings.extension = options.extension || defaults.extension
    settings.include = options.include || defaults.include
    settings.includeUri = options.includeUri || defaults.includeUri
    settings.preview = options.preview || defaults.preview
    template = fs.readFileSync(filename).toString()
    template = resolveDefs(settings, template, {}, path.dirname(filename))

    resolveIncludes(template, settings, function (template) {
        if (options.resolveDot) {
            try {
                result = doT.template(template, templateSettings)(options)
            } catch (err) {
                return callback(err);
            }
            return callback(null, result);
        }else{
            return callback(null, template);
        }
    })
}

exports.__express = module.exports.renderFile

var skip = /$^/

// 子模板并不是使用dot默认的的方式而是采用.dot文件加载的
function resolveDefs(c, block, defs, defPath) {
    return block.replace(c.templateSettings.use || skip, function (m, code) {
        // if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
        //     if (def[d] && def[d].arg && param) {
        //         var rw = (d + ":" + param).replace(/'|\\/g, "_");
        //         def.__exp = def.__exp || {};
        //         def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
        //         return s + "def.__exp['" + rw + "']";
        //     }
        // });
        var def = code.split('.')[1]
        var defName = path.resolve(defPath, c.processDefPath, def) + '.' + c.extension
        if (!(def in defs)) {
            defs[def] = fs.readFileSync(defName).toString()
        }
        var v = new Function("def", "return " + code)(defs);
        return v ? resolveDefs(c, v, defs) : v;
    })
}

function resolveIncludes(block, c, cb) {
    var includes = []
    block.replace(c.include || skip, function (_, preview, id) {
        includes.push({
            _: _,
            id: id,
            preview: !!preview
        })
        return _
    })

    function resolve() {
        var include, url
        if (includes.length) {
            include = includes.shift()
            url = c.includeUri + include.id + (include.preview ? ('?' + c.preview) : '')
            fetch(url).then(function (res) { return res.text() }).then(function (text) {
                block = block.replace(include._, text)
                resolve()
            })
        } else {
            cb(block)
        }
    }
    resolve()
}
