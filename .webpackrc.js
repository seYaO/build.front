const path = require('path')
const { version } = require('./package.json')

export default {
    entry: 'src/index.js',
    theme: './theme.config.js',
    html: {
        template: './src/entry.ejs',
    },
    publicPath: `//file.40017.cn/baoxian/settlement/${version}/`,
    outputPath: `./dist/${version}`,
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
    // 接口代理示例
    proxy: {
        "/api/v1/weather": {
            "target": "https://api.seniverse.com/",
            "changeOrigin": true,
            "pathRewrite": {
                "^/api/v1/weather": "/v3/weather"
            }
        },
    },
    extraBabelPlugins: [
        'transform-decorators-legacy', [
            'import', {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
            }
        ],
    ],
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
        },
    },
    ignoreMomentLocale: true,
    disableDynamicImport: true,
    hash: true,
}