
/**
 * 用户信息类
 */
const { Controller } = require('egg');
const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');
const fs = require('fs');

class UserController extends Controller {
	async test() {
		const { service } = this.ctx;
		this.ctx.body = await service.test.test();
	}
	/**
	 * 注册
	 * @return {[type]} [description]
	 */
	async register() {
		const { service, header, request } = this.ctx;
		const { body } = request;
		let DATA = await service.v1.user.register({ registerForm: body });
		this.ctx.body = DATA;
	}
	/**
	 * 验证邀请码
	 * @return {[type]} [description]
	 */
	async invitate() {
		const { service, header, request } = this.ctx;
		const { body } = request;
		let DATA = await service.v1.user.invitate(body);
		this.ctx.body = DATA;
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login() {
		const { service, header, request } = this.ctx;
		const { body } = request;
		let params = {
			loginForm: body
		}
		const DATA = await service.v1.user.login(params);
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
			user = await service.v1.user.userInfo(token);
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
		const user = await service.v1.user.userInfo();
		this.ctx.body = user;
	}
	/**
	 * 是否显示图片验证码(普通登录)
	 * @return {Boolean} [description]
	 */
	async isShowCaptcha() {
		const { service, query } = this.ctx;
		const { acount = '' } = query;
		const DATA = await service.v1.user.isShowCaptcha({ acount });
		this.ctx.body = DATA;
	}
	/**
	 * 验证码
	 * @return {[type]} [description]
	 */
	async captcha() {
		const { service } = this.ctx;
		const cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
		const { status, code, data } = await service.v1.user.captcha();
		let captchaCode = '0', serial;
		if(code === '0000') {
			const { imgCode, serialNo } = data;
			let crypted = cipher.update(imgCode,'utf8','hex');
			crypted += cipher.final('hex');
			captchaCode = crypted;
			serial = serialNo;
		}
		this.ctx.body = { svg: '', serialNo: serial, code: captchaCode };
	}
	async img() {
		const { service, query } = this.ctx;
		const decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8')
		const { code } = query;
		let captchaText = decipher.update(code,'hex','utf8');
		captchaText += decipher.final('utf8');
		let captcha = svgCaptcha(captchaText, {
			width: 120,
			height: 46,
			fontSize: 58,
			noise: 0,
			color: false
		});
		this.ctx.set('Content-Type', 'image/svg+xml');
		this.ctx.body = captcha;
	}
	/**
	 * 获取短信验证码
	 * @return {[type]} [description]
	 */
	async smsCode() {
		const { service, header, request } = this.ctx;
		const { body } = request;

		const DATA = await service.v1.user.smsCode(body);
		this.ctx.body = DATA;
	}
	/**
	 * 验证账号
	 * @return {[type]} [description]
	 */
	async validate() {
		const { service, header, request } = this.ctx;
		const { body } = request;

		const DATA = await service.v1.user.validate(body);
		this.ctx.body = DATA;
	}
	/**
	 * 异步验证短信验证码
	 * @return {[type]} [description]
	 */
	async validateSmsCode() {
		const { service, header, request } = this.ctx;
		const { body } = request;

		const DATA = await service.v1.user.validateSmsCode(body);
		this.ctx.body = DATA;
	}
	/**
	 * 重置登录密码
	 * @return {[type]} [description]
	 */
	async resetLogin() {
		const { service, header, request } = this.ctx;
		const { body } = request;

		const DATA = await service.v1.user.resetLogin(body);
		this.ctx.body = DATA;
	}
	/**
	 * 常用投保人
	 * @return {[type]} [description]
	 */
	async holders() {
		const { service, query, header, request } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.v1.user.holders({ memberId });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 获取会员是否设置交易密码
	 * @return {Boolean} [description]
	 */
	async isSetPayPwd() {
		const { service } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};
		if(code === '0000' && data) {
			const { memberId } = data;
			DATA = await service.v1.user.isSetPayPwd({ memberId });
		}
		this.ctx.body = DATA;
	}
	/**
	 * 设置交易密码
	 */
	async setPayPwd() {
		const { service, request } = this.ctx;
		const { body = {} } = request;
		const { code, data } = await service.v1.user.userInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				...body
			}
			DATA = await service.v1.user.setPayPwd(params);
		}
		this.ctx.body = DATA;
	}
	/**
	 * 重置交易密码
	 * @return {[type]} [description]
	 */
	async resetPayPwd() {
		const { service, request } = this.ctx;
		const { body = {} } = request;
		const { code, data } = await this.tokenToInfo();
		let DATA = {};

		if(code === '0000' && data) {
			const { memberId } = data;
			let params = {
				memberId,
				...body
			}
			DATA = await service.v1.user.resetPayPwd(params);
		}
		this.ctx.body = DATA;
	}
}

module.exports = UserController;