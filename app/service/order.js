/**
 * 订单信息接口
 */
const { Service } = require('egg');
const mock = require('../../mock/');

class OrderService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * 订单初始化
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async init(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'getOrderInitDataNew',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 下单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async add(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'addOrderNew',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 订单列表
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async list(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'orderList',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 订单初始化
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async detail(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'orderDetail',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取企业投保人信息
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async sssss(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'getEnterpriseInfo',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 取消订单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async cancel(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'cancelOrder',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 撤单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async refund(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'refundOrder',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 撤销前弹框展示
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async refundPopup(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'refundOrderPre',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 重投
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async afresh(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['order'],
			functionCode: 'reDeliver',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = OrderService;