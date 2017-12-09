
const { Service } = require('egg');

class UserService extends Service {
	constructor(ctx) {
		super(ctx);
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
			serviceName: 'com.ly.fn.bx.rpc.service.AlbAcountSafeService',
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
	async token(token) {
		let datas = {
			serviceName: 'com.ly.fn.bx.rpc.service.AlbTokenService',
			functionCode: 'getValue',
			clientInfo: { token }
		};
		const DATA = await this.request(datas);
		return DATA;
	}
	/**
	 * 用户信息
	 * @return {[type]} [description]
	 */
	async userInfo(token) {
		const DATA = await this.token(token);
		return DATA;
	}
	/**
	 * 
	 * @param  {[type]} token [description]
	 * @return {[type]}       [description]
	 */
	async expiration(token) {
		const DATA = await this.token(token);
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
			serviceName: 'com.ly.fn.bx.rpc.service.AlbTokenService',
			functionCode: 'getValue',
			clientInfo: params
		};
		const DATA = await this.request(datas);
		return DATA;
	}
}

module.exports = UserService;