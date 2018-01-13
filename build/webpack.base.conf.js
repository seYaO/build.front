/**
 * 1. 配置 webpack 编译入口
 * 2. 配置 webpack 输出路径和命名规则
 * 3. 配置模块 resolve 规则
 * 4. 配置不同类型模块的处理规则
 */

'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
// vux插件配置
// const vuxLoader = require('vux-loader')

// 给出正确的绝对路径
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const webpackConfig = {
    // 配置 webpack 编译入口
    entry: {
        app: './src/main.js'
    },

    // 配置 webpack 输出路径和命名规则
    output: {
        // webpack 输出的目标文件夹路径 例如：/dist
        path: config.build.assetsRoot,
        // webpack 输出 bundle 文件命名格式
        filename: '[name].js',
        // webpack 编译输出的发布路径
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },

    // 配置模块 resolve 的规则
    resolve: {
        // 自动 resolve 的扩展名
        extensions: ['.js', '.vue', '.json'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        // 创建路径别名，有了别名之后引用模块更方便
        // 例如：import Vue from 'vue/dist/vue.esm.js'  可以写成  import Vue from 'vue'
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'static': path.resolve(__dirname, '../static'),
            'styles': resolve('src/styles'),
        }
    },

    // 配置不同类型模块的处理规则
    module: {
        rules: [
            // 对所有 .vue 文件使用 vue-loader
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            // 对 src 和 test 文件夹下的 .js 文件使用 babel-loader
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            // 对图片资源文件使用 url-loader, query.name 指明了输出的命名规则
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            // 对视频资源文件使用 url-loader, query.name 指明了输出的命名规则
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            // 对所有 .less 文件使用 style-loader css-loader less-loader
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            // 对文字资源文件使用 url-loader, query.name 指明了输出的命名规则
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}

module.exports = webpackConfig

// 配置 vux-ui | duplicate-style 去除重复css代码
// module.exports = vuxLoader.merge(webpackConfig, {
//     plugins: ['vux-ui', 'duplicate-style']
// })
