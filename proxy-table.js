module.exports = {
    // https://github.com/chimurai/http-proxy-middleware
    '/intervacation': {
        //target: 'http://10.101.42.100:10090',
        target: 'http://10.101.40.57:3000/',
        //target: 'http://10.101.40.72:6646/',
        //target: 'http://10.100.156.179:8082',
        //target: 'http://10.101.40.59:1993',
        // target: 'http://cmsapi.t.17usoft.com',
        // target: 'http://10.101.40.20:3000/',
        changeOrigin: true,
        pathRewrite: {
            // '^/intervacation/api/PPageCenter': 'mockjsdata/1/querySlider?b=&c=&a='
        }
    },
    '/dujia/AjaxHelper': {
        target: 'http://www.ly.com',
        changeOrigin: true
    },
    '/dujia/': {
        target: 'http://www.ly.com',
        changeOrigin: true,
        pathRewrite: {}
    }

}
