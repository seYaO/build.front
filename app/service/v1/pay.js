/**
 * 支付信息接口
 */
const { Service } = require('egg');

class PayService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * 支付初始化
	 * @return {[type]} [description]
	 */
	async init(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['pay'],
			functionCode: 'toInitPay',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		const { status, code, message, data } = DATA;
		let newData = null;
		if(code === '0000'){
			newData = {
				dealPwd: data['dealPwd'],
				orderCode: data['orderCode'],
				productCode: data['order']['productCode'],
				countDown: data['countDown'],
				orderPayInfo: data['orderPayInfo'],
				userAmount: data['userAmount']
			};
		}
		return { status, code, message, data: newData };
	}
	/**
	 * 获取支付连接
	 * @return {[type]} [description]
	 */
	async url(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['pay'],
			functionCode: 'getMobilePayUrl',
			clientInfo: params
		};
		console.log(datas)
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 现金账户支付
	 * @return {[type]} [description]
	 */
	async balance(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['pay'],
			functionCode: 'balancePay',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 授权账户支付
	 * @return {[type]} [description]
	 */
	async credit(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['pay'],
			functionCode: 'creditPay',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 支付成功
	 * @return {[type]} [description]
	 */
	async success(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['pay'],
			functionCode: 'paySucceed',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = PayService;