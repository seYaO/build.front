/**
 * 优惠信息类
 */
const { Controller } = require('egg');

class DiscountController extends Controller {
	/**
	 * 获取可用红包
	 * @return {[type]} [description]
	 */
	async getReadPacket() {
		const { service, query, header } = this.ctx;
		const { token = '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e' } = header;
		const { productCode, orderCode = '' } = query;
		const { code, data } = await service.user.userInfo(token);
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.discount.getReadPacket({ memberId, productCode, orderCode });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取订单已绑定红包
	 * @return {[type]} [description]
	 */
	async bindReadPacket() {
		const { service, query, header } = this.ctx;
		const { token = '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e' } = header;
		const { orderCode = '' } = query;
		const { code, data } = await service.user.userInfo(token);
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.discount.bindReadPacket({ memberId, orderCode });
		}
		this.ctx.body = DATA;
	}
}

module.exports = DiscountController;