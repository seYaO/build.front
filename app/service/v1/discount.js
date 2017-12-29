/**
 * 优惠信息接口
 */
const { Service } = require('egg');

class DiscountService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * 获取可用红包
	 * @return {[type]} [description]
	 */
	async getReadPacket(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['readPacket'],
			functionCode: 'getUsableRedPacket',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取订单已绑定红包
	 * @return {[type]} [description]
	 */
	async bindReadPacket(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['readPacket'],
			functionCode: 'bindRedPacket',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = DiscountService;