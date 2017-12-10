'use strict';

module.exports = app => {
    const { router } = app;

    router.get(`/api/img`, 'user.img');

    // user
    router.post(`/api/login`, 'user.login'); // 登录
    router.get(`/api/userInfo`, 'user.userInfo'); // 用户信息
    router.get(`/api/captcha`, 'user.captcha'); // 验证码
    router.get(`/api/validate`, 'user.validate'); // 验证账号
    router.get(`/api/resetLogin`, 'user.resetLogin'); // 重置登录密码
    router.get(`/api/isSetPayPwd`, 'user.isSetPayPwd'); // 获取会员是否设置交易密码
    router.get(`/api/setPayPwd`, 'user.setPayPwd'); // 设置交易密码
    router.get(`/api/resetPayPwd`, 'user.resetPayPwd'); // 重置交易密码
    router.get(`/api/smsCode`, 'user.smsCode'); // 获取短信验证码
    router.get(`/api/validateSmsCode`, 'user.validateSmsCode'); // 异步验证短信验证码
    
    // discount 优惠
    router.get(`/api/getReadPacket`, 'discount.getReadPacket');
    router.get(`/api/bindReadPacket`, 'discount.bindReadPacket');
    // other
    router.get(`/api/airport`, 'other.airport');
    router.get(`/api/downLoad`, 'other.downLoad'); // 下载文件
}