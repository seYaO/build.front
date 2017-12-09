'use strict';

module.exports = app => {
    const { router } = app;
    // user
    router.get(`/api/captcha`, 'user.captcha');
    router.get(`/api/userInfo`, 'user.userInfo');
    router.post(`/api/login`, 'user.login');
    // discount 优惠
    router.get(`/api/getReadPacket`, 'discount.getReadPacket');
    router.get(`/api/bindReadPacket`, 'discount.bindReadPacket');
    // other
    router.get(`/api/airport`, 'other.airport');
}