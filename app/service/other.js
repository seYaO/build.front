/**
 * 其他信息
 * ----------
 * ocr识别
 * 机场信息
 */
const { Service } = require('egg');
const mock = require('../../mock/');

class OtherService extends Service {
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
	 * ocr识别
	 * @return {[type]} [description]
	 */
	async ocr(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['ocr'],
			functionCode: 'recogniseCard',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取机场信息
	 * @return {[type]} [description]
	 */
	async airport(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['airport'],
			functionCode: 'getAlbAirportInfo',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = OtherService;