
'use strict'
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const version = require('../version')[0];

module.exports = {
    // 构建产品时使用的配置
    build: {
        // webpack 的编译环境
        env: require('./prod.env'),
        // 编译输入的 index.html 文件
        index: path.resolve(__dirname, `../dist/index.html`),
        // webpack 输出的目标文件夹路径
        assetsRoot: path.resolve(__dirname, `../dist`),
        // webpack 编译输出的二级文件夹
        assetsSubDirectory: version,
        // webpack 编译输出的发布路径
        assetsPublicPath: `//file.40017.cn/baoxian/agb-mobile/`,
        // 是否使用 SourceMap
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        // 默认不打开开启 gzip 模式
        productionGzip: false,
        // gzip 模式下需要压缩的文件的扩展名
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },

    // 开发过程中使用的配置
    dev: {
        // webpack 的编译环境
        env: require('./dev.env'),
        // dev-server 监听的端口
        port: process.env.PORT || 8070,
        // 启动 dev-server 之后自动打开浏览器
        autoOpenBrowser: true,
        // webpack 编译输出的二级文件夹
        assetsSubDirectory: 'static',
        // webpack 编译输出的发布路径
        assetsPublicPath: '/',
        // 请求代理表，在这里可以配置特定的请求代理到对应的 API 接口
        proxyTable: {
            '/api': {
                "target": `http://10.101.48.82:7001/`,
                "changeOrigin": true
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        // 是否开启 cssSourceMap
        cssSourceMap: false
    }
}
