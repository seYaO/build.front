'use strict'
// Template version: 1.2.5
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const version = require('../version')[0]
const ip = require('../build/get-ip-Adress')

module.exports = {
    // 开发过程中使用的配置
    dev: {

        // Paths
        // webpack 编译输出的二级文件夹
        assetsSubDirectory: 'static',
        // webpack 编译输出的发布路径
        assetsPublicPath: '/',
        // 请求代理表，在这里可以配置特定的请求代理到对应的 API 接口
        proxyTable: {},

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        // dev-server 监听的端口
        port: process.env.PORT || 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        // 是否开启 cssSourceMap
        cssSourceMap: false,
    },

    // 构建产品时使用的配置
    build: {
        // Template for index.html
        // 编译输入的 index.html 文件
        index: path.resolve(__dirname, `../dist/index.html`),
        // webpack 输出的目标文件夹路径
        assetsRoot: path.resolve(__dirname, `../dist`),
        // webpack 编译输出的二级文件夹
        assetsSubDirectory: `${version}`,
        // webpack 编译输出的发布路径
        assetsPublicPath: `//file.40017.cn/baoxian/agb-mobile/`,
        // 是否使用 SourceMap
        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}
