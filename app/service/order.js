/**
 * 订单信息接口
 */
const { Service } = require('egg');

class OrderService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			order: 'com.ly.fn.bx.rpc.service.AlbOrderEncapsulateService'
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
	 * 订单初始化
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async init(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'getOrderInitDataNew',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 下单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async add(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'addOrderNew',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 订单列表
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async list(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'orderList',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 订单初始化
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async detail(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'orderDetail',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 获取企业投保人信息
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async init(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'getEnterpriseInfo',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 取消订单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async cancel(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'cancelOrder',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 撤单
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async refund(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'refundOrder',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 撤销前弹框展示
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async refundPopup(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'refundOrderPre',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 重投
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async afresh(params) {
		let datas = {
			serviceName: this.serviceInfo['order'],
			functionCode: 'reDeliver',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = OrderService;