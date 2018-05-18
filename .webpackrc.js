const { version } = require('./package.json')

const webpackrcConfig = {
    entry: 'src/index.js',
    publicPath: '/',
    // 配置 html-webpack-plugin 插件
    html: {
        template: './src/entry.ejs',
    },
    alias: {
        components: `${__dirname}/src/components`,
        utils: `${__dirname}/src/utils`,
        config: `${__dirname}/src/utils/config`,
        enums: `${__dirname}/src/utils/enums`,
        services: `${__dirname}/src/services`,
        models: `${__dirname}/src/models`,
        routes: `${__dirname}/src/routes`,
        styles: `${__dirname}/src/styles`,
    },
    "proxy": {
        "/api": {
            "target": "http://jsonplaceholder.typicode.com/",
            "changeOrigin": true,
            "pathRewrite": {
                "^/api": ""
            }
        }
    },
    extraBabelPlugins: [
        'transform-decorators-legacy',
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ],
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
        },
    },
    ignoreMomentLocale: true, // 忽略moment的locale文件，用于减少尺寸
    disableDynamicImport: false, // 禁用import()按需加载，全部打包在一个文件里，通过 babel-plugin-dynamic-import-node-sync 实现
    
}

if(process.env.NODE_ENV === 'production'){
    Object.assign(webpackrcConfig, {
        publicPath: `//file.40017.cn/baoxian/ant-design/${version}`,
        outputPath: `./dist/${version}`,
        hash: true, // 配置让构建产物文件名带 hash，通常会和 manifest 配合使用
    })
}
export default webpackrcConfig