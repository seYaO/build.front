const { genSidebarConfig } = require('./index')
const guide = [
    {
        title: '博客',
        collapsable: false,
        children: ['', 'git', 'linux', 'mac']
    },
    {
        title: 'css3',
        collapsable: true,
        children: ['css3/flex', 'css3/use']
    }
]

const frontend = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09_0', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29_0', '29', '30_0', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39_0', '39', '40', '41', '42_01', '42_02', '42', '43', '44', '45', '46', '47', '48_0']

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

function jstutorialData() {
    function fn(key) {
        let arr = [];
        jstutorial[key].map(item => {
            arr.push(`${key}/${item}`);
        })
        return arr
    }

    return [
        { title: '导论', collapsable: false, children: fn('introduction') },
        { title: '语法', collapsable: false, children: fn('grammar') },
        { title: '标准库', collapsable: false, children: fn('stdlib') },
        { title: '面向对象编程', collapsable: false, children: fn('oop') },
        { title: '语法专题', collapsable: false, children: fn('advanced') },
        { title: 'DOM 模型', collapsable: false, children: fn('dom') },
        { title: '浏览器环境', collapsable: false, children: fn('bom') },
        { title: 'Web API', collapsable: false, children: fn('htmlapi') },
        { title: 'jQuery', collapsable: false, children: fn('jquery') },
        { title: '函数库', collapsable: false, children: fn('library') },
        { title: 'Node.js', collapsable: false, children: fn('nodejs') },
        { title: '开发工具', collapsable: false, children: fn('tool') },
        { title: 'webapp', collapsable: false, children: fn('webapp') },
        { title: '附录', collapsable: false, children: fn('appendix') },
    ]
}

module.exports = {
    '/guide/': genSidebarConfig(guide),
    '/relearnFrontEnd/': genSidebarConfig([{ title: '重学前端', children: frontend }]),
    '/es6tutorial/': genSidebarConfig([{ title: 'es6', children: es6tutorial }]),
    '/jstutorial/': genSidebarConfig(jstutorialData(), true),
}