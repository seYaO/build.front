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
	/**
	 * 下载文件
	 * @return {[type]} [description]
	 */
	async downLoad() {
		let url = 'https://www.qa.ly.com/baoxian/download/elecPolicy/33ff3fef48fb4469c7f1b29221976dc9d7b12bb5d47ab596d30d59daffa4e1f168994edb59909ddf2ed39898c7776f7615d1436e8c008bd645061579cf3a47c4f0966a84365aa1b91f7ae9b2b52be24ef33a77054dde9c485dd413320783a514';
		const { service, query } = this.ctx;
		this.ctx.attachment('hello.pdf');
		this.ctx.set('Content-Type', 'application/octet-stream');
		this.ctx.body = await service.common.downLoad({ url });
	}
}

module.exports = OtherController;