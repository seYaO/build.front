
/**
 * 用户信息接口
 */
const { Service } = require('egg');

class UserService extends Service {
	constructor(ctx) {
		super(ctx);
		this.serviceInfo = {
			token: 'com.ly.fn.bx.rpc.service.AlbTokenService',
			login: 'com.ly.fn.bx.rpc.service.AlbLoginService',
			safe: 'com.ly.fn.bx.rpc.service.AlbAcountSafeService',
			holder: 'com.ly.fn.bx.rpc.service.AlbHolderService',
			sms: 'com.ly.fn.bx.rpc.service.AlbSmsCodeService'
		};
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
	 * 验证码
	 * @return {[type]} [description]
	 */
	async captcha() {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'getImgCode'
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * token
	 * @param  {[type]} token [description]
	 * @return {[type]}       [description]
	 */
	async userInfo(token) {
		let datas = {
			serviceName: this.serviceInfo['token'],
			functionCode: 'getValue',
			clientInfo: { token }
		};
		const DATA = await this.request(datas);
		const { code } = DATA;
		if(code === '1001'){
			this.ctx.redirect('/login');
		}
		return DATA;
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login(params) {
		let datas = {
			serviceName: this.serviceInfo['login'],
			functionCode: 'checkLogin',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 常用投保人
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async holders(params) {
		let datas = {
			serviceName: this.serviceInfo['holder'],
			functionCode: 'getHolderList',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 获取短信验证码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async holders(params) {
		let datas = {
			serviceName: this.serviceInfo['sms'],
			functionCode: 'sendSmsCode',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 验证账号
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async validate(params) {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'validateAcount',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 重置登录密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async resetLogin(params) {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'resetLoginPassword',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 获取会员是否设置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async isSetPayPwd(params) {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'qryPayPwd',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 设置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async setPayPwd(params) {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'setPayPwd',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 重置交易密码
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	async resetPayPwd(params) {
		let datas = {
			serviceName: this.serviceInfo['safe'],
			functionCode: 'resetPayPwd',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = UserService;