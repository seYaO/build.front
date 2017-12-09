const { userInfo, captcha } = require('./users');

const mock = {
	/**
	 * 用户信息
	 */
	// com.ly.fn.bx.rpc.service.AlbLoginService
	checkLogin: captcha, // 登录
	// com.ly.fn.bx.rpc.service.AlbTokenService
	getValue: userInfo, // token获取会员信息
	// com.ly.fn.bx.rpc.service.AlbAcountSafeService
	getImgCode: captcha, // 获取图片验证码
	validateAcount: captcha, // 验证账号
	resetLoginPassword: captcha, // 重置登录密码
	qryPayPwd: captcha, // 获取会员是否设置交易密码
	setPayPwd: captcha, // 设置交易密码
	resetPayPwd: captcha, // 重置交易密码
	// com.ly.fn.bx.rpc.service.AlbSmsCodeService
	sendSmsCode: captcha, // 获取短信验证码
	// com.ly.fn.bx.rpc.service.AlbHolderService
	getHolderList: captcha, // 常用投保人
	/**
	 * 产品信息
	 */
	// com.ly.fn.bx.rpc.service.AlbProductEncapsulateService
	getAlbInsuranceTypeList: captcha, // 产品分类
	getProductList: captcha, // 产品列表
	getAlbProductDetail: captcha, // 产品详情
	/**
	 * 优惠信息
	 */
	// com.ly.fn.bx.rpc.service.AlbRedPacketService
	getUsableRedPacket: captcha, // 获取可用红包
	bindRedPacket: captcha, // 获取订单已绑定红包
	/**
	 * 订单信息
	 */
	// com.ly.fn.bx.rpc.service.AlbOrderEncapsulateService
	getOrderInitDataNew: captcha, // 订单初始化
	addOrderNew: captcha, // 下单
	orderList: captcha, // 订单列表
	orderDetail: captcha, // 订单详情
	getEnterpriseInfo: captcha, // 获取企业投保人信息
	cancelOrder: captcha, // 取消订单
	refundOrderPre: captcha, // 撤销前弹框展示
	refundOrder: captcha, // 撤单
	reDeliver: captcha, // 重投
	/**
	 * 支付信息
	 */
	// com.ly.fn.bx.rpc.service.AlbPayEncapsulateService
	toInitPay: captcha, // 支付初始化
	getMobilePayUrl: captcha, // 获取支付连接
	balancePay: captcha, // 现金账户支付
	creditPay: captcha, // 授权账户支付
	paySucceed: captcha, // 支付成功
	/**
	 * 其他信息
	 */
	// com.ly.fn.bx.rpc.service.AlbOcrService
	recogniseCard: captcha, // ocr识别
	// com.ly.fn.bx.rpc.service.AlbCommonService
	getAlbAirportInfo: captcha, // 获取机场信息
}

module.exports = (type) => {
	const data = mock[type];
	return {
		status: '200',
		data
	};
}