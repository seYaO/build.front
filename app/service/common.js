/**
 * 公共方法
 */
const fs = require('fs');
const path = require('path');
const { Service } = require('egg');
const mocks = require('../../mock/');

class CommonService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			token: 'com.ly.fn.bx.rpc.service.AlbTokenService',
			login: 'com.ly.fn.bx.rpc.service.AlbLoginService',
			safe: 'com.ly.fn.bx.rpc.service.AlbAcountSafeService',
			holder: 'com.ly.fn.bx.rpc.service.AlbHolderService',
			sms: 'com.ly.fn.bx.rpc.service.AlbSmsCodeService',
			product: 'com.ly.fn.bx.rpc.service.AlbProductEncapsulateService',
			order: 'com.ly.fn.bx.rpc.service.AlbOrderEncapsulateService',
			readPacket: 'com.ly.fn.bx.rpc.service.AlbRedPacketService',
			pay: 'com.ly.fn.bx.rpc.service.AlbPayEncapsulateService',
			ocr: 'com.ly.fn.bx.rpc.service.AlbOcrService',
			airport: 'com.ly.fn.bx.rpc.service.AlbCommonService',
			email: 'com.ly.fn.bx.rpc.service.AlbEmailService',
			register: 'com.ly.fn.bx.rpc.service.AlbRegisterService',
			user: 'com.ly.fn.bx.rpc.service.AlbUserService'
		};
	}
	/**
	 * 获取服务数据
	 * @param  {[type]} params [description]
	 * @param  {Object} opts   [description]
	 * @return {[type]}        [description]
	 */
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
		let result;
		if(this.config.useMock){
			result = mocks(params['functionCode']);
		}else{
			result = await this.ctx.curl(url, _opts);
			result = result.data;
		}
		const { status, data } = result;

		let DATA = { status };
		if(params['functionCode'] === 'getProvinceAndCity'){
			Object.assign(DATA, { data })
		}else{
			Object.assign(DATA, { ...data })
		}
		if(status !== '200') {
			DATA = { status, message: 'node服务错误' };
		}
		return DATA;
	}
	/**
	 * 修改随机数
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async version(params) {
		const versionPath = path.resolve('version.txt');
		const { v } = params;
		fs.writeFileSync(versionPath, v, 'utf8');
		return v;
	}
	/**
	 * downLoad文件
	 * @return {[type]} [description]
	 */
	async downLoad(params) {
		const { url } = params;
		let result = await this.ctx.curl(url, { timeout: [ '30s', '30s' ] })
		// console.log('result-----------',result)
		return result.data;
	}
	async getPrice(price) {
		price = price.toFixed(2);
	    price = price.replace(/(\d*)(\.)(\d*)/, (a, b, c, d) => {
	        if (d === '00') {
	            return b;
	        } else {
	            if (/\d0/.test(d)) {
	                d = d[0];
	            }
	            return `${b}.${d}`;
	        }
	    })
	    return Number(price);
	}
}
module.exports = CommonService;