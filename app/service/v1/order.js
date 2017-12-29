/**
 * 订单信息接口
 */
const { Service } = require('egg');

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
		const { status, code, message, data } = DATA;
		let newData = null;
		if(code === '0000'){
			newData = {
				title: data['title'],
				dec: data['suitePeople'],
				// -----------------------------------------
				delayDays: data['delayDays'],
				fixedBeginTimeLimit: data['fixedBeginTimeLimit'],
				endInsuranceTime: data['endInsuranceTime'],
				restricPersonNum: data['restricPersonNum'],
				// -----------------------------------------
				flightCode: data['flightCode'],
				showAirPort: data['showAirPort'],
				// -----------------------------------------
				businessTypeList: data['businessType'], // 与企业投保人关系
				businessRelationList: data['businessRelation'], // 企业证件类型
				// -----------------------------------------
				holderCardTypeList: data['holderCredList'], // 投保人证件类型
				holderGenderList: data['holderSexList'], // 投保人性别
				insurantRelationList: data['insurantRelList'], // 与投保人关系
				insurantCardTypeList: data['insurantCredList'], // 被保人证件类型
				insurantGenderList: data['sexList'], // 被保人性别
				// ----------------------------------------
				holderCardType: data['holderCredList'] && data['holderCredList'].length > 0 ? true : false,
				holderGender: data['holderSexList'] && data['holderSexList'].length > 0 ? true : false,
				insurantRelation: data['insurantRelList'] && data['insurantRelList'].length > 0 ? true : false,
				insurantCardType: data['insurantCredList'] && data['insurantCredList'].length > 0 ? true : false,
				insurantGender: data['sexList'] && data['sexList'].length > 0 ? true : false,
				insurantEmail: data['email'],
				insurantPhone: data['phone'],
			};
		}
		return { status, code, message, data: newData };
	}
	/**
	 * 获取企业投保人信息
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async enterprise(params) {
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
		const { status, code, message, count, data } = DATA;
		let newData = null, total, totalPage = 0;
		if(code === '0000'){
			newData = [];
			data.map((item, index) => {
				let price = item['totalFee'] - item['reduceRateAmount'] - item['redPacketFee'];
				price = price >= 0 ? price.toFixed(2) : 0;
				let obj = {
					orderCode: item['orderCode'],
					productCode: item['productCode'],
					title: item['productName'],
					safeguardPeriod: item['safeguardPeriod'],
					totalFee: item['totalFee'],
					orderStatus: item['orderStatus'],
					names: item['insurantNames'],
					waterMark: item['waterMark'],
					price,
					hasPay: (item['orderStatus'] === '待支付' && item['isProductValid'] == 0) ? true : false, // 立即支付
					hasCancel: item['hasCancelBtn'], // 删除
					hasRedeliver: item['hasRedeliverBtn'], // 重投
					hasReturn: item['hasReturnBtn'], // 退保
					hasDownload: item['hasDownloadBtn'], // 下载保单
				};
				newData.push(obj);
			});
			totalPage = Math.ceil(count / params.listQueryForm.pageSize)
		}
		return { status, code, message, totalPage, data: newData };
	}
	/**
	 * 订单详情
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
		// console.log(datas)
		const { status, code, message, data } = DATA;
		let newData = null;
		if(code === '0000'){
			let insurants = data['albInsurantDetailVOs'];
			insurants.map((item, index) => {
				item['isDownload'] = item['policyStatus'] === '投保成功' && (item['policyUrl'] || item['certificateUrl']) ? true : false;
				return item;
			});
			let price = await common.getPrice(data['totalFee'] - data['reduceRateAmount'] - data['redPackageDeductibleAmount'])
			newData = {
				title: data['title'],
				companyName: data['companyName'],
				productCode: data['productCode'],
				orderCode: data['orderCode'],
				isProductValid: data['isProductValid'],
				safeguardPeriod: data['safeguardPeriod'],
				orderStatus: data['orderStatus'],
				createTime: data['createTime'],
				flightCode: data['flightCode'],
				insurantNumber: data['albInsurantDetailVOs'] ? data['albInsurantDetailVOs'].length : 0,
				totalQty: data['totalQty'],
				totalFee: data['totalFee'],
				discountPrice: data['reduceRateAmount'],
				redPackagePrice: data['redPackageDeductibleAmount'],
				startAirportName: data['startAirportName'],
				arriveAirportName: data['arriveAirportName'],
				tourGroupCode: data['tourGroupCode'],
				price,
				hasPay: (data['orderStatus'] === '待支付' && data['isProductValid'] == 0) ? true : false, // 立即支付
				isGroup: data['isGroup'] ? true : false,
				isSendEmail: data['isSendEmail'],
				holderName: data['isEnterprise'] ? data['enterpriseName'] : data['holderName'],
				insurants
			}
		}
		return { status, code, message, data: newData };
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
		console.log(datas)
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = OrderService;