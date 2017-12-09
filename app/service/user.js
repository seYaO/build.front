
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
			safe: 'com.ly.fn.bx.rpc.service.AlbAcountSafeService'
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
}

module.exports = UserService;