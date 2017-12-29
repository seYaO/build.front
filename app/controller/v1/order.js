/**
 * 订单信息
 */
const { Controller } = require('egg');

class OrderController extends Controller {
	/**
	 * 订单初始化
	 * @return {[type]} [description]
	 */
	async init() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { productCode = '', safeguardPlanCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			let params = {
				productCode,
				safeguardPlanCode
			}
			DATA = await service.v1.order.init(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取企业投保人信息
	 * @return {[type]} [description]
	 */
	async enterprise() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { productCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				productCode,
			}
			DATA = await service.v1.order.enterprise(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 下单
	 * @return {[type]} [description]
	 */
	async add() {
		const { service, request } = this.ctx;
		const { body = {} } = request;
		const { code, data } = await service.v1.user.userInfo();
		const { base = {}, holder = {}, insurants = [], priceFactors = {} } = body;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId, cMerberId, acount } = data;
			let orderFromJson = {
				refId: base.refId || '',
				platid: base.platid || '',
				productCode: base.productCode || '',
				safeguardPlanCode: base.safeguardPlanCode || '',
				effectTime: base.startTime ? `${base.startTime} 00:00:00` : '',
				ticketNo: base.flight || '',
				startAirport: base.startAirport || '',
				arriveAirport: base.arriveAirport || '',
				tourGroupCode: base.tourGroup || '',
				qty: base.qty || 0,
				totalFee: base.totalFee || 0,
				// -------------------------------------
				holderDefault: base.insureType || 0,
				isGroup: base.insureMethod || 0

				
			 //    "deviceId": "",
			}
			if(holder.type === 'enterprise'){
				const { enterprise } = holder;
				Object.assign(orderFromJson, {
					enterpriseName: enterprise.name || '',
					enterpriseCredType: enterprise.cardType || '',
					enterpriseCredNo: enterprise.cardNo || '',
					enterprisePhone: enterprise.phone || '',
					enterpriseEmail: enterprise.email || '',
					holderName: enterprise.name || '',
					holderCardType: enterprise.cardType || '',
					holderCardNo: enterprise.cardNo || '',
					holderMobile: enterprise.phone || '',
					holderEmail: enterprise.email || ''
				})
			}else{
				const { person, enterprise } = holder;
				Object.assign(orderFromJson, {
					holderName: person.name || '',
					holderCardType: person.cardType || '',
					holderCardNo: person.cardNo || '',
					holderBirthday: person.birthday || '',
					holderGender: person.gender || '',
					holderMobile: person.phone || '',
					holderEmail: person.email || ''
				})
			}
			let insurantArr = [];
			insurants.map((item, index) => {
				let obj = {
					insuredRelation: item['relation'] || '',
					insuredName: item['name'] || '',
					insuredCardType: item['cardType'] || '',
					insuredCardNo: item['cardNo'] || '',
					insuredBirthday: item['birthday'] || '',
					insuredGender: item['gender'] || '',
					// insuredAge: item['name'] || '',
					insuredMobile: item['phone'] || '',
					insuredEmail: item['email'] || '',
					qty: 1,
					priceFactors: item['priceFactors']
				}
				insurantArr.push(obj);
			})
			Object.assign(orderFromJson, { addInsurantForms: insurantArr, priceFactors })
			console.log(orderFromJson)
			let params = {
				memberId,
				cMerberId,
				acount,
				orderFromJson: JSON.stringify(orderFromJson),
			}
			// console.log(JSON.stringify(params))
			DATA = await service.v1.order.add(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 订单列表
	 * @return {[type]} [description]
	 */
	async list() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { type = '', page = 1, pageSize = 8 } = query;
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId, cMemberId = '' } = data;
			let params = {
				albMemberId: memberId,
				cMemberId,
				holderName: '',
				insurantName: '',
				orderCode: '',
				tourGroupCode: '',
				startDate: '',
				endDate: '',
				orderStatus: type,
				pageSize,
				pageIndex: page
			}
			DATA = await service.v1.order.list({ listQueryForm: params });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 订单详情
	 * @return {[type]} [description]
	 */
	async detail() {
		const { service, query } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const { orderCode = '' } = query;
		let DATA = {};
		if(code === '0000' && data){
			const { memberId, cMemberId = '' } = data;
			DATA = await service.v1.order.detail({ memberId, cMemberId, orderCode });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 取消订单
	 * @return {[type]} [description]
	 */
	async cancel() {
		const { service, query } = this.ctx;
		const { orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				orderCode,
			}
			DATA = await service.v1.order.cancel(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 撤单
	 * @return {[type]} [description]
	 */
	async refund() {
		const { service, query } = this.ctx;
		const { orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				orderCode,
			}
			DATA = await service.v1.order.refund(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 撤销前弹框展示
	 * @return {[type]} [description]
	 */
	async refundPopup() {
		const { service, query } = this.ctx;
		const { orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				orderCode,
			}
			DATA = await service.v1.order.refundPopup(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 重投
	 * @return {[type]} [description]
	 */
	async afresh() {
		const { service, query } = this.ctx;
		const { orderCode = '' } = query;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				orderCode,
			}
			DATA = await service.v1.order.afresh(params);
		}
		this.ctx.body = DATA;
	}
}

module.exports = OrderController;