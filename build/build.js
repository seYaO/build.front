/**
 * 1. loading 动画
 * 2. 删除创建目标文件夹
 * 3. webpack 编译
 * 4. 输出信息
 */

'use strict'
// 检查 nodejs 和 npm 的版本
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
// 用于在控制台输出带颜色字体的插件
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const fs = require('fs')

const spinner = ora('building for production...')
spinner.start() // 开启 loading 动画

//require('./git-detect')() // 检测git

// 删除旧的目标文件夹
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
        spinner.stop() // 停止 loading 动画
        if (err) throw err
        // 没有出错则输出相关信息
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))

        //上传打包文件
        require('./upload-static-file')();
    })
})
