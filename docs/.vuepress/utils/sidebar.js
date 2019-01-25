const { genSidebarConfig } = require('./index')

// es6
const es6tutorial = ['', 'intro', 'let', 'destructuring', 'string', 'regex', 'number', 'function', 'array', 'object', 'symbol', 'set-map', 'proxy', 'reflect', 'promise', 'iterator', 'generator', 'generator-async', 'async', 'class', 'class-extends', 'decorator', 'module', 'module-loader', 'style', 'spec', 'arraybuffer', 'proposals', 'reference']

const jstutorial = {
    introduction: ['', 'history'],
    grammar: ['', 'types', 'number', 'string', 'object', 'array', 'function', 'operator', 'conversion', 'error', 'style'],
    stdlib: ['object', 'array', 'wrapper', 'number', 'string', 'math', 'date', 'regexp', 'json', 'arraybuffer', 'attributes'],
    oop: ['', 'this', 'prototype', 'object', 'pattern'],
    advanced: ['single-thread', 'timer', 'promise', 'strict', 'fsm', 'interpreter', 'backbonejs', 'ecmascript6'],
    dom: ['', 'document', 'element', 'attribute', 'text', 'event', 'event-type', 'css', 'mutationobserver', 'image'],
    bom: ['', 'window', 'history', 'cookie', 'webstorage', 'same-origin', 'ajax', 'cors', 'mobile', 'performance', 'notification', 'indexeddb'],
    htmlapi: ['', 'eventsource', 'file', 'form', 'fullscreen', 'pagevisibility', 'requestanimationframe', 'svg', 'webcomponents', 'webspeech', 'webworker', 'websocket', 'webrtc'],
    jquery: ['', 'deferred', 'jquery-free', 'plugin', 'utility'],
    library: ['d3', 'datejs', 'designpattern', 'modernizr', 'sorting', 'underscore'],
    nodejs: ['', 'npm', 'packagejson', 'util', 'version', 'timer', 'path', 'fs', 'http', 'url', 'module', 'events', 'os', 'querystring', 'stream', 'assert', 'buffer', 'process', 'child-process', 'cluster', 'develop', 'cluster', 'error', 'repl', 'express', 'koa', 'mongodb', 'net', 'dns'],
    tool: ['bower', 'browserify', 'console', 'grunt', 'gulp', 'lint', 'phantomjs', 'requirejs', 'sourcemap', 'testing'],
    webapp: ['cache', 'progressive', 'serviceworker'],
    appendix: ['api', 'plugins'],
}

module.exports = {
    '/es6tutorial/': genSidebarConfig('es6', es6tutorial),
    '/jstutorial/introduction/': genSidebarConfig('导论', jstutorial.introduction),
    '/jstutorial/grammar/': genSidebarConfig('语法', jstutorial.grammar),
    '/jstutorial/stdlib/': genSidebarConfig('标准库', jstutorial.stdlib),
    '/jstutorial/oop/': genSidebarConfig('面向对象编程', jstutorial.oop),
    '/jstutorial/advanced/': genSidebarConfig('语法专题', jstutorial.advanced),
    '/jstutorial/dom/': genSidebarConfig('DOM 模型', jstutorial.dom),
    '/jstutorial/bom/': genSidebarConfig('浏览器环境', jstutorial.bom),
    '/jstutorial/htmlapi/': genSidebarConfig('Web API', jstutorial.htmlapi),
    '/jstutorial/jquery/': genSidebarConfig('jQuery', jstutorial.jquery),
    '/jstutorial/library/': genSidebarConfig('函数库', jstutorial.library),
    '/jstutorial/nodejs/': genSidebarConfig('Node.js', jstutorial.nodejs),
    '/jstutorial/tool/': genSidebarConfig('开发工具', jstutorial.tool),
    '/jstutorial/webapp/': genSidebarConfig('webapp', jstutorial.webapp),
    '/jstutorial/appendix/': genSidebarConfig('附录', jstutorial.appendix),
}