/**
 * v1版本api接口
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */

const apiPrefix = '/api/v1/';

module.exports = app => {
	const { router } = app;

	// user
    router.post(`${apiPrefix}register`, 'v1.user.register'); // 注册
    router.post(`${apiPrefix}invitate`, 'v1.user.invitate'); // 验证邀请码
    router.get(`${apiPrefix}isShowCaptcha`, 'v1.user.isShowCaptcha'); // 是否显示图片验证码(普通登录)
    router.post(`${apiPrefix}smsCode`, 'v1.user.smsCode'); // 获取短信验证码
    router.get(`${apiPrefix}img`, 'v1.user.img'); // 验证码
    router.get(`${apiPrefix}captcha`, 'v1.user.captcha'); // 验证码
	router.post(`${apiPrefix}login`, 'v1.user.login'); // 登录
	router.get(`${apiPrefix}userInfo`, 'v1.user.userInfo'); // 用户信息
    router.post(`${apiPrefix}validate`, 'v1.user.validate'); // 验证账号
    router.post(`${apiPrefix}validateSmsCode`, 'v1.user.validateSmsCode'); // 异步验证短信验证码
    router.post(`${apiPrefix}resetLogin`, 'v1.user.resetLogin'); // 重置登录密码
    router.get(`${apiPrefix}holders`, 'v1.user.holders'); // 常用投保人
    router.get(`${apiPrefix}isSetPayPwd`, 'v1.user.isSetPayPwd'); // 获取会员是否设置交易密码
    router.post(`${apiPrefix}setPayPwd`, 'v1.user.setPayPwd'); // 设置交易密码
    router.post(`${apiPrefix}resetPayPwd`, 'v1.user.resetPayPwd'); // 重置交易密码

    // product
    router.get(`${apiPrefix}productClassify`, 'v1.product.classify'); // 产品列表分类
    router.get(`${apiPrefix}productList`, 'v1.product.list'); // 产品列表
    router.get(`${apiPrefix}productDetail`, 'v1.product.detail'); // 产品详情

    // discount 优惠
    router.get(`${apiPrefix}getReadPacket`, 'v1.discount.getReadPacket'); // 获取可用红包
    router.get(`${apiPrefix}bindReadPacket`, 'v1.discount.bindReadPacket'); // 获取订单已绑定红包

    // order
    router.get(`${apiPrefix}orderInit`, 'v1.order.init'); // 下单初始化
    router.get(`${apiPrefix}enterprise`, 'v1.order.enterprise'); // 获取企业投保人信息
    router.post(`${apiPrefix}orderAdd`, 'v1.order.add'); // 下单
    router.get(`${apiPrefix}orderList`, 'v1.order.list'); // 订单列表
    router.get(`${apiPrefix}orderDetail`, 'v1.order.detail'); // 订单详情
    router.get(`${apiPrefix}orderCancel`, 'v1.order.cancel'); // 取消订单
    router.get(`${apiPrefix}orderRefund`, 'v1.order.refund'); // 撤单
    router.get(`${apiPrefix}orderRefundPopup`, 'v1.order.refundPopup'); // 撤销前弹框展示
    router.get(`${apiPrefix}orderAfresh`, 'v1.order.afresh'); // 重投

    // pay
    router.get(`${apiPrefix}payInit`, 'v1.pay.init'); // 支付初始化
    router.post(`${apiPrefix}payUrl`, 'v1.pay.url'); // 获取支付连接
    router.post(`${apiPrefix}payBalance`, 'v1.pay.balance'); // 现金账户支付
    router.post(`${apiPrefix}payCredit`, 'v1.pay.credit'); // 授权账户支付
    router.get(`${apiPrefix}paySuccess`, 'v1.pay.success'); // 支付成功

    // other
    router.get(`${apiPrefix}city`, 'v1.other.city'); // 城市
    router.get(`${apiPrefix}airport`, 'v1.other.airport'); // 机场
    router.post(`${apiPrefix}ocr`, 'v1.other.ocr');
    router.post(`${apiPrefix}getEmail`, 'v1.other.email'); // 发送电子邮箱
}