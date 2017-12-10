/**
 * 优惠信息接口
 */
const { Service } = require('egg');
const mock = require('../../mock/');

class DiscountService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	async request(params, opts = {}) {
		let url = this.config.apiServer;
		let _opts = {
			timeout: [ '30s', '30s' ],
			dataType: 'json',
			method: 'post',
			contentType: 'json',
			data: params
		};
		Object.assign(_opts, opts);
		let result;
		if(this.config.useMock){
			result = mock(params['functionCode']);
		}else{
			result = await this.ctx.curl(url, _opts);
			result = result.data;
		}
		const { status, data } = result;
		let DATA = { status, ...data };
		if(status !== '200') {
			DATA = { status, message: 'node服务错误' };
		}
		return DATA;
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