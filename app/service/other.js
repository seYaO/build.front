/**
 * 其他信息
 * ----------
 * ocr识别
 * 机场信息
 */
const { Service } = require('egg');

class OtherService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			ocr: 'com.ly.fn.bx.rpc.service.AlbOcrService',
			airport: 'com.ly.fn.bx.rpc.service.AlbCommonService'
		}
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
		const result = await this.ctx.curl(url, _opts);
		const { status, data } = result.data;
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
		let datas = {
			serviceName: this.serviceInfo['ocr'],
			functionCode: 'recogniseCard',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 获取机场信息
	 * @return {[type]} [description]
	 */
	async airport(params) {
		let datas = {
			serviceName: this.serviceInfo['airport'],
			functionCode: 'getAlbAirportInfo',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = OtherService;