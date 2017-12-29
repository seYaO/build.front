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
		const { service, query } = this.ctx;
		const { productCode, orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = { redPacketForm: { memberId, productCode, orderCode } };
			DATA = await service.v1.discount.getReadPacket(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取订单已绑定红包
	 * @return {[type]} [description]
	 */
	async bindReadPacket() {
		const { service, query, header } = this.ctx;
		const { orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = { memberId, orderCode };
			DATA = await service.v1.discount.bindReadPacket(params);
		}
		this.ctx.body = DATA;
	}
}

module.exports = DiscountController;