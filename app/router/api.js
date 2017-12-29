'use strict';

module.exports = app => {
    const { router } = app;

    router.get(`/api/download`, 'api.download'); // 下载文件

    // -----------------------------------------------------

    router.get(`/api/test`, 'v1.user.test');
    router.get(`/testApiServer`, 'api.testApiServer')

}