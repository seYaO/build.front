'use strict';

module.exports = app => {
    const { router } = app;
    // user
    router.get('/api/captcha', 'user.captcha');
    router.get('/api/userInfo', 'user.userInfo');
    router.post('/api/login', 'user.login');
}