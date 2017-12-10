/**
 * 产品信息接口
 */
const { Service } = require('egg');
const mock = require('../../mock/');

class ProductService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * 产品分类
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async classify(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'getAlbInsuranceTypeList',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 产品列表
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async list(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'getProductList',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 产品详情
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async detail(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'getAlbProductDetail',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = ProductService;