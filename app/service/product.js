/**
 * 产品信息接口
 */
const { Service } = require('egg');

class ProductService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			product: 'com.ly.fn.bx.rpc.service.AlbProductEncapsulateService'
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
	 * 产品分类
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async classify(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'getAlbInsuranceTypeList',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 产品列表
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async list(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'getProductList',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 产品详情
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async detail(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'getAlbProductDetail',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = ProductService;