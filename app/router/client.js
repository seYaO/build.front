'use strict';

module.exports = app => {
    const { router } = app;
    router.get('/register', 'client.register');
    router.get('/login', 'client.login');
    router.get('/reset/step1', 'client.reset');
    router.get('/reset/step2', 'client.reset');
    router.get('/', 'client.index');
    router.get('/list', 'client.index');
    router.get('/product/detail/:id', 'client.index');
    router.get('/order/fillin', 'client.index');
    router.get('/order/list', 'client.index');
    router.get('/order/detail/:id', 'client.index');
    router.get('/pay/:id', 'client.index');
    router.get('/pay/success/:id', 'client.index');
    router.get('/dealPwd', 'client.index');
    router.get('/product/instruction', 'client.index');
    router.get('/product/clause', 'client.index');
    router.get('/product/claims', 'client.index');
    router.get('/product/inform', 'client.index');
}