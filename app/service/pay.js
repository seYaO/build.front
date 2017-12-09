/**
 * 支付信息接口
 */
const { Service } = require('egg');
const mock = require('../../mock/');

class PayService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			pay: 'com.ly.fn.bx.rpc.service.AlbPayEncapsulateService'
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
	/**
	 * 支付初始化
	 * @return {[type]} [description]
	 */
	async init(params) {
		let datas = {
			serviceName: this.serviceInfo['pay'],
			functionCode: 'toInitPay',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 获取支付连接
	 * @return {[type]} [description]
	 */
	async url(params) {
		let datas = {
			serviceName: this.serviceInfo['pay'],
			functionCode: 'getMobilePayUrl',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 现金账户支付
	 * @return {[type]} [description]
	 */
	async balance(params) {
		let datas = {
			serviceName: this.serviceInfo['pay'],
			functionCode: 'balancePay',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 授权账户支付
	 * @return {[type]} [description]
	 */
	async credit(params) {
		let datas = {
			serviceName: this.serviceInfo['pay'],
			functionCode: 'creditPay',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 支付成功
	 * @return {[type]} [description]
	 */
	async success(params) {
		let datas = {
			serviceName: this.serviceInfo['pay'],
			functionCode: 'paySucceed',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = PayService;