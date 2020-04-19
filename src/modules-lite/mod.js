/**
 * file: mod.js
 * ver: 1.0.3
 * auth: zhangjiachen@baidu.com
 * update: 11:48 2013/7/10
 *
 */
    /* jshint -W079 */
    /* jshint -W020 */
/**
 * 增加depMap兼容amd语法（类似同步的requirejs）
 * css模块依赖（!css）被去除，不解析
 * update: 16-11-09
 * author: 09798
 */
__inline('monitor.js')
var require,
    define;
/* global Monitor */
(function(self) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        depMap = {},
        resMap, pkgMap;


    function loadScript(id, callback) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        //
        // load this script
        //
        var res = resMap[id] || {};
        var url = res.pkg?
                pkgMap[res.pkg].url
                : (res.url || id);

        if (! (url in scriptsMap))  {
            scriptsMap[url] = true;

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.src = url;
            head.appendChild(script);
        }
    }

    define = function(id, dep, factory) {
        if(!factory){
            factory = dep
            dep = []
        }
        factoryMap[id] = factory;
        depMap[id] = dep

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            // Monitor.module(mod.exports,id);
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw Error('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            'exports': {}
        };

        //
        // factory: function OR value
        //
        var dep = depMap[id]
            // 不解析css模块依赖
            .filter(function(id){return !/^css!/.test(id)})
            .map(function(id){return require(id)})
        var ret = (typeof factory === 'function')?
            // dep.length ? factory.apply(mod, dep) : factory.apply(mod, [require, mod.exports, mod])
            factory.apply(mod, [require, mod.exports, mod])
            : factory;

        if (ret) {
            mod.exports = ret;
        }
        // Monitor.module(mod.exports,id);
        return mod.exports;
    };

    require.async = function(names, callback) {
        if (typeof names === 'string') {
            names = [names];
        }

        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed);

                var child = resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 === needNum--) {
                var i, n, args = [];
                for(i = 0, n = names.length; i < n; ++i) {
                    args[i] = require(names[i]);
                }
                callback && callback.apply(self, args);
            }
        }

        findNeed(names);
        updateNeed();
    };
    require.resourceMap = function(obj) {
        resMap = obj.res || {};
        pkgMap = obj.pkg || {};
    };

    require.alias = function(id) {return id;};

})(window);
define.cmd = true
__inline('config.js')