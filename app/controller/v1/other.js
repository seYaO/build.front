/**
 * 其他信息
 * ----------
 * ocr识别
 * 机场信息
 */
const { Controller } = require('egg');

class OtherController extends Controller {
	/**
	 * ocr识别
	 * @return {[type]} [description]
	 */
	async ocr() {
		const { service, header, request } = this.ctx;
		const { body } = request;
		// let params = { cardType: 1, ...body };
		let DATA = await service.v1.other.ocrScreen(body);
		this.ctx.body = DATA;
	}
	/**
	 * 机场信息
	 * @return {[type]} [description]
	 */
	async airport() {
		const { service, query } = this.ctx;
		const { name = '' } = query;
		let DATA = await service.v1.other.airport({ airportName: name });
		this.ctx.body = DATA;
	}
	/**
	 * 发送电子邮箱
	 * @return {[type]} [description]
	 */
	async email() {
		const { service, request } = this.ctx;
		const { body } = request;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.v1.other.email({ memberId, ...body });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取所有省市
	 * @return {[type]} [description]
	 */
	async city() {
		const { service, query } = this.ctx;
		const { name = '' } = query;
		let DATA = await service.v1.other.city({ });
		this.ctx.body = DATA;
	}
}

module.exports = OtherController;