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
		const { token = '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e' } = header;
		const { body } = request;
		const { code, data } = await service.user.userInfo(token);
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.other.ocr(body);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 机场信息
	 * @return {[type]} [description]
	 */
	async airport() {
		const { service, query } = this.ctx;
		const { airportName = '' } = query;
		let DATA = await service.other.airport({ airportName });
		this.ctx.body = DATA;
	}
}

module.exports = OtherController;