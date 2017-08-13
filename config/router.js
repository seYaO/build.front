// 页面路由配置

let router = require('koa-router')();
let entries = require('./entries');
let proxy = require('./proxy') || {};

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

entries.sort(compare('sort'));

let pagelist = proxy.type ? 'pagelist' : '/';

router.get(pagelist, async ctx => {

    ctx.state = {
        title: '集合页',
        entries: entries
    }

    await ctx.render('index.html');
});

// 
entries.forEach(item => {
    if (item['route']) {
        router.get(item['route'], async ctx => {
            ctx.state = item['state'] ? item['state'] : '';
            await ctx.render(`./.temp/pages${item['path']}`);
        });
    }
});

module.exports = router;