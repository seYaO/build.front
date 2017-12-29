/**
 * 1. 合并基础的 webpack 配置
 * 2. 使用 styleLoaders
 * 3. 配置 webpack 插件
 * 4. 配置 webpack 插件
 * 5. gzip 模式下的 webpack 插件配置
 * 6. webpack-bundle 分析
 */

'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 复制静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于从 webpack 生成的 bundle 中提取文本到特定文件中的插件
// 可以抽取出 css, js 文件将其与 webpack 输出的 bundle 分离
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const version = require('../version')

const env = config.build.env

// 合并基础的 webpack 配置
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    // 配置 webpack 的输出
    output: {
        // 编译输出目录
        path: config.build.assetsRoot,
        // 编译输出文件名格式
        filename: utils.assetsPath('js/[name].js'),
        // 没有指定输出名的文件输出的文件名格式
        chunkFilename: utils.assetsPath('js/[name].chunk.[chunkhash:16].js')
    },

    // 配置 webpack 插件
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // https://doc.webpack-china.org/plugins/context-replacement-plugin/
        // 处理 monent 插件的语言格式
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
        // 处理压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        // extract css into its own file
        // 抽离 css 文件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
})

// gizp 模式下需要引入 compression 插件进行压缩
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
