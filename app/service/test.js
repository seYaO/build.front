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
	async test() {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'getImgCode'
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = TestService;