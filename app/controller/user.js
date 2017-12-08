
const { Controller } = require('egg');
const svgCaptcha = require('svg-captcha');

class UserController extends Controller {
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
	/**
	 * 用户信息
	 * @return {[type]} [description]
	 */
	async userInfo() {
		const { service, header } = this.ctx;
		const { token = '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e' } = header;
		const DATA = await service.user.userInfo(token);
		this.ctx.body = DATA;
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login() {
		const { service, query, header, request } = this.ctx;
		const { body } = request;
		const DATA = await service.user.login(body);

		this.ctx.body = DATA;
	}
}

module.exports = UserController;