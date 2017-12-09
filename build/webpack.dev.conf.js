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
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// 合并基础的 webpack 配置
const devWebpackConfig = merge(baseWebpackConfig, {
    // 配置样式文件的处理规则，使用 styleLoaders
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    // 配置 Source Maps 在开发中使用 cheap-module-eval-source-map 更快
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    // 配置 webpack 插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
