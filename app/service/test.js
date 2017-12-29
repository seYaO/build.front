/**
 * 支付信息接口
 */
const { Service } = require('egg');
const mock = require('../../mock/');


class TestService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			safe: 'com.ly.fn.bx.rpc.service.AlbAcountSafeService'
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
		let result = await this.ctx.curl(url, _opts);
		return result.data;
	}
	async test() {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'getImgCode'
		};
		const DATA = await this.request(datas);
		const DATA2 = await this.request(datas);
		return {DATA,DATA2};
	}
}

module.exports = TestService;