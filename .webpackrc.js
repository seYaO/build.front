const path = require('path')
const { version } = require('./package.json')

export default {
    entry: 'src/index.js',
    theme: './theme.config.js',
    // html: {
    //     template: './src/index.ejs',
    // },
    publicPath: `//file.40017.cn/baoxian/settlement/${version}/`,
    outputPath: `./dist/${version}`,
    alias: {
        'components': path.resolve(__dirname, 'src/components/'),
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