/**
 * 支付信息接口
 */
const { Controller } = require('egg');

class PayController extends Controller {
	/**
	 * 支付初始化
	 * @return {[type]} [description]
	 */
	async init() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { orderCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				orderCode,
			}
			DATA = await service.v1.pay.init(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取支付连接
	 * @return {[type]} [description]
	 */
	async url() {
		const { service, request } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { body = {} } = request;
		// const { orderCode = '', payProduct = 0, couponNo = '', clientIP = '', openId = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				...body
			}
			DATA = await service.v1.pay.url(params);
		}
		console.log(DATA)
		this.ctx.body = DATA;
	}
	/**
	 * 现金账户支付
	 * @return {[type]} [description]
	 */
	async balance() {
		const { service, request } = this.ctx;
		const { body = {} } = request;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId, cMerberId } = data;
			let params = {
				memberId,
				cMerberId,
				...body,
			}
			DATA = await service.v1.pay.balance(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 授权账户支付
	 * @return {[type]} [description]
	 */
	async credit() {
		const { service, request } = this.ctx;
		const { body = {} } = request;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId, cMerberId } = data;
			let params = {
				memberId,
				cMerberId,
				...body,
			}
			DATA = await service.v1.pay.credit(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 支付成功
	 * @return {[type]} [description]
	 */
	async success() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { payType = '', orderCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				payType,
				orderCode,
			}
			DATA = await service.v1.pay.success(params);
		}
		this.ctx.body = DATA;
	}
}

module.exports = PayController;