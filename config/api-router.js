let fs = require('fs');
let router = require('koa-router')();
let _ = require('lodash');
let entries = require('./entries');

router.get('/order/list', ctx => {
    ctx.body = fs.readFileSync('./src/api/orderList.json', 'utf-8');
});


// api接口路由
! function apiList() {
    let _apiList = [];
    entries.forEach(item => {
        if (item['api'] && item['api'][0]) {
            _apiList = [..._apiList, ...item['api']];
        }
    });

    let seen = {};
    _apiList = _apiList.filter(value => {
        return seen.hasOwnProperty(value['route']) ? false : (seen[value['route']] = true);
    });

    _apiList.forEach(item => {
        if (item['type'] === 'get') {
            router.get(item['route'], ctx => {
                ctx.body = fs.readFileSync(item['path'], 'utf-8');
            });
        } else {
            router.post(item['route'], ctx => {
                ctx.body = fs.readFileSync(item['path'], 'utf-8');
            });
        }
    });
}();


module.exports = router;