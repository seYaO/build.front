const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const router = require('koa-router')();
const app = new Koa();
const port = 8989;

const staticPath = './modules';

app.use(static(
    path.resolve(staticPath)
))

app.use(views(
    path.resolve('./'), {
        map: {
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


router.get('/', async ctx => {
    await ctx.render('index.html');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`application is start: http://localhost:${port}`);
});