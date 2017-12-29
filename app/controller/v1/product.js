/**
 * 产品信息
 */
const { Controller } = require('egg');

class ProductController extends Controller {
	/**
	 * 产品分类
	 * @return {[type]} [description]
	 */
	async classify() {
		const { service, header, request } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.v1.product.classify({ memberId });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 产品列表
	 * @return {[type]} [description]
	 */
	async list() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { type = 'albAll', page = 1, pageSize = 8 } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				insuranceTypeCode: type,
				tagCode: '',
				sortFlag: 0,
				productName: '',
				platform: 3,
				pageSize,
				pageNo: page
			}
			DATA = await service.v1.product.list({ params: params });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 产品详情
	 * @return {[type]} [description]
	 */
	async detail() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { productCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.v1.product.detail({ memberId, productCode });
		}
		this.ctx.body = DATA;
	}
}

module.exports = ProductController;