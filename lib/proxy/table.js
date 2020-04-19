module.exports = {
    // // https://github.com/chimurai/http-proxy-middleware
    // '/youlun': {
    //     target: 'http://www.ly.com',
    //     changeOrigin: true,
    //     pathRewrite: {
    //         // '^/intervacation/api/PPageCenter': 'mockjsdata/1/querySlider?b=&c=&a='
    //     }
    // },
    '/AjaxHelper': {
        target: 'http://m.ly.com',
        changeOrigin: true
    }
    ,
    '/youlun': {
        // target: 'http://10.101.42.61:8080',
        // target: 'http://m.qa.ly.com',
        target: 'http://m.t.ly.com',
        changeOrigin: true,
        pathRewrite: {
            // '^/intervacation/api/PPageCenter': 'mockjsdata/1/querySlider?b=&c=&a='
        }
    }
}