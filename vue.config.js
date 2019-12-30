const { indexs } = require('./index.config')
let pages = {
    index: {
        entry: 'src/main.js',
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
}
indexs.map(item => {
    pages[item] = {
        entry: 'src/main.js',
        template: `public/${item}/index.html`,
        filename: `${item}.html`,
        chunks: ['chunk-vendors', 'chunk-common', `${item}`]
    }
})

module.exports = {
    pages,
    devServer: {
        // 代理
        proxy: {
            '/scenery': {
                target: 'https://www.ly.com',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
            '/Scenery': {
                target: 'https://www.ly.com',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
            '/wlfrontend': {
                target: 'https://www.ly.com',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
        }
    },
}