/**
 * 产品信息接口
 */
const { Service } = require('egg');

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
			serviceName: common.serviceInfo['product'],
			functionCode: 'getAlbInsuranceTypeList',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		const { status, code, message, data } = DATA;
		let arr = null;
		if(code === '0000'){
			arr = [{ code: 'albAll', name: '全部', curr: true }]
			data.map((item, index) => {
				let { insuranceTypeCode: code, insuranceTypeName: name } = item;
				name = name.slice(0,2)
				arr.push({ code, name, curr: false })
			})
		}
		return { status, code, message, data: arr };
	}
	/**
	 * 产品列表
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async list(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['product'],
			functionCode: 'getProductList',
			clientInfo: params
		};
		console.log(datas)
		const DATA = await common.request(datas);
		const { status, code, message, data } = DATA;
		let newData = null, totalPage = 0;
		if(code === '0000'){
			newData = [];
			const { totalSize, totalCount, productBaseList } = data;
			totalPage = totalSize;
			productBaseList.map((item, index) => {
				let obj = {
					picture: item['productPic'],
					code: item['productCode'],
					title: item['productName'],
					name: item['insuranceCompanyName'],
					tags: item['tags'],
					sales: item['sales'],
					minPrice: item['minPrice'],
					redPacket: item['redPacketFlag'] ? '红包可用' : '',
					discount: item['reduceRate'] ? `优惠比例${item['reduceRate']}%` : ''
				}
				newData.push(obj)
			})
		}
		return { status, code, message, totalPage, data: newData };
	}
	/**
	 * 产品详情
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async detail(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['product'],
			functionCode: 'getAlbProductDetail',
			clientInfo: params
		};
		console.log(datas)
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = ProductService;