const { login, userInfo, captcha, validate, resetLogin, isSetPayPwd, setPayPwd, resetPayPwd, smsCode, validateSmsCode, holders } = require('./users');
const { productClassify, productList, productDetail } = require('./product');
const { initPay, payUrl, payBalance, payCredit, paySuccess } = require('./pay');
const { airport } = require('./other');

const mock = {
	/**
	 * 用户信息
	 */
	// com.ly.fn.bx.rpc.service.AlbLoginService
	checkLogin: login, // 登录
	// com.ly.fn.bx.rpc.service.AlbTokenService
	getValue: userInfo, // token获取会员信息
	// com.ly.fn.bx.rpc.service.AlbAcountSafeService
	getImgCode: captcha, // 获取图片验证码
	validateAcount: validate, // 验证账号
	resetLoginPassword: resetLogin, // 重置登录密码
	qryPayPwd: isSetPayPwd, // 获取会员是否设置交易密码
	setPayPwd: setPayPwd, // 设置交易密码
	resetPayPwd: resetPayPwd, // 重置交易密码
	// com.ly.fn.bx.rpc.service.AlbSmsCodeService
	sendSmsCode: smsCode, // 获取短信验证码
	validateSmsCode: validateSmsCode, // 异步验证短信验证码
	// com.ly.fn.bx.rpc.service.AlbHolderService
	getHolderList: holders, // 常用投保人
	/**
	 * 产品信息
	 */
	// com.ly.fn.bx.rpc.service.AlbProductEncapsulateService
	getAlbInsuranceTypeList: productClassify, // 产品分类
	getProductList: productList, // 产品列表
	getAlbProductDetail: productDetail, // 产品详情
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
	toInitPay: initPay, // 支付初始化
	getMobilePayUrl: payUrl, // 获取支付连接
	balancePay: payBalance, // 现金账户支付
	creditPay: payCredit, // 授权账户支付
	paySucceed: paySuccess, // 支付成功
	/**
	 * 其他信息
	 */
	// com.ly.fn.bx.rpc.service.AlbOcrService
	recogniseCard: captcha, // ocr识别
	// com.ly.fn.bx.rpc.service.AlbCommonService
	getAlbAirportInfo: airport, // 获取机场信息
}

module.exports = (type) => {
	const data = mock[type];
	return {
		status: '200',
		data
	};
}