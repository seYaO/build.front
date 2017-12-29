/**
 * 其他信息
 * ----------
 * ocr识别
 * 机场信息
 */
const { Service } = require('egg');

class OtherService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * ocr调数据
	 * @param  {[type]} params [description]
	 * @param  {Object} opts   [description]
	 * @return {[type]}        [description]
	 */
	async ocrRequest(params, opts = {}) {
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
		return result;
	}
	/**
	 * ocr识别
	 * @return {[type]} [description]
	 */
	async ocr(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['ocr'],
			functionCode: 'recogniseCard',
			clientInfo: params
		};
		const DATA = await this.ocrRequest(datas);
		return DATA;
	}
	/**
	 * 筛选证件号
	 * @return {[type]} [description]
	 */
	async ocrScreen(params) {
		const d1 = await this.ocr({ ...params, cardType: 0 });
		const d2 = await this.ocr({ ...params, cardType: 1 });
		let DATA, data1, data2;
		{
			const { status, data } = d1;
			let falg = false;
			if(data){
				let d = JSON.parse(data);
				const { identify_code, birthday, gender, name, idnum } = d;
				if(identify_code === '0000'){
					if(birthday || gender || name || idnum){
						falg = true;
					}

					let birthdayStr = '';
					if(birthday && birthday['year'] && birthday['month'] && birthday['day']){
						birthdayStr = `${birthday['year']}-${birthday['month']}-${birthday['day']}`;
					}
					let genderStr = '';
					if(gender === '男'){
						genderStr = 'M'
					}else if(gender === '女'){
						genderStr = 'F'
					}

					data1 = {
						name,
						cardType: '1',
						cardNo: idnum,
						birthday: birthdayStr,
						gender: genderStr,
						falg
					}
				}
			}
		}
		{
			const { status, data } = d2;
			let falg = false;
			const Moths = { 'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 'SEPT': '09', 'OCT': '10', 'NOV': '11', 'DES': '12' }
			if(data){
				let d = JSON.parse(data);
				const { identify_code, birthday, sex, name, passport_number } = d;
				if(identify_code === '0000'){
					falg = true;
					let birthdayStr = '', gender = '';
					let matchs = birthday.match(/\d*.([a-zA-Z]*).\d*/);
					let matchStr = '';
					if(matchs){
						matchStr = matchs[1];
					}
					let numStr = Moths[matchStr.toUpperCase()] || '';
					if(numStr){
						let reg = RegExp(matchStr, 'i');
						let str = birthday.replace(reg, numStr);
						birthdayStr = str.replace(/ /g, '-');
					}
					if(sex === '男'){
						gender = 'M'
					}else if(sex === '女'){
						gender = 'F'
					}

					data2 = {
						name,
						cardType: '2',
						cardNo: passport_number,
						birthday: birthdayStr,
						gender,
						falg
					}
				}
			}
		}
		if(data1 && data1.falg) {
			return { code: '0000', message: '成功', status: '200', data: data1 };
		}
		if(data2 && data2.falg){
			return { code: '0000', message: '成功', status: '200', data: data2 };
		}
		return { code: '1000', message: '失败', status: '200', data: null };
	}
	/**
	 * 获取机场信息
	 * @return {[type]} [description]
	 */
	async airport(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['airport'],
			functionCode: 'getAlbAirportInfo',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		const { status, code, message, data } = DATA;
		let newData = null;
		if(code === '0000'){
			newData = [];
			const { airportList } = data;
			airportList.map((item) => {
				let obj = {};
				obj['initial'] = item['firstWord'];
				obj['cells'] = [];
				const airports = item['airports'];
				airports.map((_item) => {
					let _obj = {};
					_obj['name'] = _item['airportName'];
					_obj['code'] = _item['airportCode'];
					obj['cells'].push(_obj);
				});
				newData.push(obj)
			})
		}
		return { status, code, message, data: newData };
	}
	/**
	 * 发送电子邮箱
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async email(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['email'],
			functionCode: 'sendEmailForUser',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取所有省市
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async city(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['airport'],
			functionCode: 'getProvinceAndCity',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
}

module.exports = OtherService;