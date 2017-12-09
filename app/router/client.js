'use strict';

module.exports = app => {
    const { router } = app;
    router.get('/', 'client.index');
    router.get('/list', 'client.index');
    router.get('/detail', 'client.index');
}