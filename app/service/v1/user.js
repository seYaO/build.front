
/**
 * 用户信息接口
 */
const { Service } = require('egg');

class UserService extends Service {
	constructor(ctx) {
		super(ctx);
	}
	/**
	 * 注册
	 * @return {Boolean} [description]
	 */
	async register(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['register'],
			functionCode: 'registerUser',
			clientInfo: params
		};
		console.log('注册-------------------', datas)
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 验证邀请码
	 * @return {Boolean} [description]
	 */
	async invitate(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['user'],
			functionCode: 'validateInvitateCode',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 是否显示图片验证码(普通登录)
	 * @return {Boolean} [description]
	 */
	async isShowCaptcha(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['login'],
			functionCode: 'isShowImg',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['login'],
			functionCode: 'checkLogin',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * token获取数据
	 * @param  {[type]} token [description]
	 * @return {[type]}       [description]
	 */
	async token() {
		const { common } = this.ctx.service;
		const token = this.ctx.cookies.get('token') || null;
		if(!token) {
			// this.ctx.redirect('/login');
			return {};
		}
		let datas = {
			serviceName: common.serviceInfo['token'],
			functionCode: 'getValue',
			clientInfo: { token }
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 用户信息
	 * @param  {[type]} token [description]
	 * @return {[type]}       [description]
	 */
	async userInfo() {
		const { common } = this.ctx.service;
		const token = this.ctx.cookies.get('token') || null;
		if(!token) {
			this.ctx.redirect('/login');
			return {};
		}
		let datas = {
			serviceName: common.serviceInfo['token'],
			functionCode: 'getValue',
			clientInfo: { token }
		};
		const DATA = await common.request(datas);
		const { code } = DATA;
		if(code === '1001'){
			this.ctx.redirect('/login');
		}
		return DATA;
	}
	/**
	 * 验证码
	 * @return {[type]} [description]
	 */
	async captcha() {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'getImgCode'
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 验证账号
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async validate(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'validateAcount',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 重置登录密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async resetLogin(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'resetLoginPassword',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取会员是否设置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async isSetPayPwd(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'qryPayPwd',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 设置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async setPayPwd(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'setPayPwd',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 重置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async resetPayPwd(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['safe'],
			functionCode: 'resetPayPwd',
			clientInfo: params
		};
		console.log('重置交易密码---------------------------',datas)
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 获取短信验证码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async smsCode(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['sms'],
			functionCode: 'sendSmsCode',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 异步验证短信验证码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async validateSmsCode(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['sms'],
			functionCode: 'validateSmsCode',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		return DATA;
	}
	/**
	 * 常用投保人
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async holders(params) {
		const { common } = this.ctx.service;
		let datas = {
			serviceName: common.serviceInfo['holder'],
			functionCode: 'getHolderList',
			clientInfo: params
		};
		const DATA = await common.request(datas);
		const { status, code, message, data } = DATA;
		let newData = null;
		if(code === '0000'){
			newData = [];
			data.map((item, index) => {
				item['isShow'] = false;
				// if(index === 0){
				// 	item['isShow'] = true;
				// }
				newData.push(item)
			})
		}
		return { status, code, message, data: newData };
	}
}

module.exports = UserService;