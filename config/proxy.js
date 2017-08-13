/**
 * @author 王莉(wl09720@ly.com)
 * @module 代理表
 * @exports
 * @desc https://github.com/chimurai/http-proxy-middleware
 */

module.exports = {
    /*
     * @param type
     * 0 不启动代理，只用本地测试接口；
     * 1 启用代理，关闭本地测试接口；
     * 2 代理和本地测试同时启用；
     * 注意：本地测试接口和服务同时启用时，接口地址相同的情况下显示本地测试数据
     */
    type: 0,
    proxyTable: {
        '/': { // 代理登录页面
            target: 'https://aigobo.cn', // 代理线上
            // target: 'http://10.100.172.34:6678', // 代理集测
            changeOrigin: true
        },
        '/api/*': { // 代理 api下的所有接口
            target: 'https://aigobo.cn', // 代理线上
            // target: 'http://10.100.172.34:6678', // 代理集测
            changeOrigin: true
        },
        '/product/*': { 
            target: 'https://aigobo.cn', // 代理线上
            // target: 'http://10.100.172.34:6678', // 代理集测
            changeOrigin: true
        },        
        '/register/*': { 
            target: 'https://aigobo.cn', // 代理线上
            // target: 'http://10.100.172.34:6678', // 代理集测
            changeOrigin: true
        },
        '/login/*': { 
            target: 'https://aigobo.cn', // 代理线上
            // target: 'http://10.100.172.34:6678', // 代理集测
            changeOrigin: true
        }
    }
}