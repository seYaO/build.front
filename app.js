let fs = require('fs');
let path = require('path');
let Koa = require('koa');
let views = require('koa-views');
let static = require('koa-static');
let c2k = require('koa2-connect');
let httpProxyMiddleware = require('http-proxy-middleware'); // 代理
let router = require('koa-router')();
let page = require('./config/router'); // 页面路由
let api = require('./config/api-router'); // 接口路由
let config = require('./config.js');
let proxyList = require('./config/proxy') || {};

let app = new Koa();

const staticPath = './output/public';

app.use(static(
    path.resolve(staticPath)
))

app.use(views(
    path.resolve('./'), {
        map: {
            ftl: 'ejs',
            html: 'ejs'
        },
    }
));

// logger
app.use(async(ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})


router.use('/', page.routes(), page.allowedMethods());

if (!proxyList.type || proxyList.type === 2) {
    router.use('/api', api.routes(), api.allowedMethods());
}
if (proxyList.type && (proxyList.type === 1 || proxyList.type === 2)) {
    let proxyTable = proxyList.proxyTable || {};
    Object.keys(proxyTable).forEach(context => {
        let opts = proxyTable[context];
        if (typeof opts === 'string') {
            opts = {
                target: opts
            };
        }
        router.all(context, c2k(httpProxyMiddleware(opts)));
    });
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.build.port, () => {
    console.log(`application is start: http://localhost:${config.build.port}`);
});