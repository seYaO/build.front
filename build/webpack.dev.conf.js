/**
 * 1. 将 hot-reload 相关的代码添加到 entry chunks
 * 2. 合并基础的 webpack 配置
 * 3. 使用 styleLoaders
 * 4. 配置 Source Maps
 * 5. 配置 webpack 插件
 */

'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 一个可以合并数组和对象的插件
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 一个用于生成 HTMl 文件并自动注入依赖文件 (link/script) 的 webpack 插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于更友好地输出 webpack 的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// 合并基础的 webpack 配置
module.exports = merge(baseWebpackConfig, {
    // 配置样式文件的处理规则，使用 styleLoaders
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    // 配置 Source Maps 在开发中使用 cheap-module-eval-source-map 更快
    devtool: '#cheap-module-eval-source-map',
    // 配置 webpack 插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // 后页面中的报错不会阻塞，但是会在编译结束后报错
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
})
