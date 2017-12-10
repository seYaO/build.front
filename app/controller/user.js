
/**
 * 用户信息类
 */
const { Controller } = require('egg');
const svgCaptcha = require('svg-captcha');

class UserController extends Controller {
	async img() {
		const { service } = this.ctx;
		this.ctx.body = await service.user.captcha();
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login() {
		const { service, header, request } = this.ctx;
		const { body } = request;
		const DATA = await service.user.login(body);
		const { code, data } = DATA;
		if(code === '0000' && data){
			const { token } = data;
			token && this.ctx.cookies.set('token', token);
		}

		this.ctx.body = DATA;
	}
	/**
	 * 根据token获取用户信息
	 * @return {[type]} [description]
	 */
	async tokenToInfo() {
		const { service, cookies } = this.ctx;
		const token = cookies.get('token');
		let user = {};
		if(token) {
			user = await service.user.userInfo(token);
		}else{
			this.ctx.redirect('/login');
		}
		return user;
	}
	/**
	 * 用户信息
	 * @return {[type]} [description]
	 */
	async userInfo() {
		const { service, cookies } = this.ctx;
		const user = await service.user.userInfo(token);
		this.ctx.body = user;
	}
	/**
	 * 验证码
	 * @return {[type]} [description]
	 */
	async captcha() {
		const { service } = this.ctx;
		const { status, code, data } = await service.user.captcha();
		let captchaText = '0';
		if(code === '0000') {
			const { imgCode } = data;
			captchaText = imgCode;
		}

		let captcha = svgCaptcha(captchaText, {
			width: 120,
			height: 46,
			fontSize: 40,
			noise: 0,
			color: true,
			background: '#eee'
		});
		this.ctx.body = captcha;
	}
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	// ------------------------------------------------------------
	/**
	 * 验证账号
	 * @return {[type]} [description]
	 */
	async validate() {
		const { service, query, header, request } = this.ctx;

		let params = {
			acount: '13771854930',
			serialNo: 'IG5A2CAF93102017DAC9',
			imgCode: '5HYQN'
		}
		const DATA = await service.user.validate(params);
		this.ctx.body = DATA;
	}
	/**
	 * 重置登录密码
	 * @return {[type]} [description]
	 */
	async resetLogin() {
		const { service, query, header, request } = this.ctx;

		let params = {
			acount: '13771854930',
			newpwd: 'abc123',
			verificationCode: '1234'
		}
		const DATA = await service.user.resetLogin(params);
		this.ctx.body = DATA;
	}
	/**
	 * 获取会员是否设置交易密码
	 * @return {Boolean} [description]
	 */
	async isSetPayPwd() {
		const { service } = this.ctx;
		const { code, data } = await this.tokenToInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.user.isSetPayPwd({ memberId });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 设置交易密码
	 */
	async setPayPwd() {
		const { service, query, header, request } = this.ctx;
		const { code, data } = await this.tokenToInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				acount: '13771854930',
				pwd: 'IG5A2CAF93102017DAC9',
				verificationCode: '5HYQN'
			}
			DATA = await service.user.setPayPwd(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 重置交易密码
	 * @return {[type]} [description]
	 */
	async resetPayPwd() {
		const { service, query, header, request } = this.ctx;
		const { code, data } = await this.tokenToInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				acount: '13771854930',
				pwd: 'IG5A2CAF93102017DAC9',
				verificationCode: '5HYQN'
			}
			DATA = await service.user.resetPayPwd(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取短信验证码
	 * @return {[type]} [description]
	 */
	async smsCode() {
		const { service, query, header, request } = this.ctx;

		let params = {
			acount: '13771854930',
			codeType: 2,
			serialNo: '1234',
			imgCode: '12312'
		}
		const DATA = await service.user.smsCode(params);
		this.ctx.body = DATA;
	}
	/**
	 * 异步验证短信验证码
	 * @return {[type]} [description]
	 */
	async validateSmsCode() {
		const { service, query, header, request } = this.ctx;

		let params = {
			acount: '13771854930',
			codeType: 2,
			verificationCode: '1234'
		}
		const DATA = await service.user.validateSmsCode(params);
		this.ctx.body = DATA;
	}
	/**
	 * 常用投保人
	 * @return {[type]} [description]
	 */
	async holders() {
		const { service, query, header, request } = this.ctx;
		const { code, data } = await this.tokenToInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.user.holders({ memberId });
		}
		this.ctx.body = DATA;
	}
}

module.exports = UserController;