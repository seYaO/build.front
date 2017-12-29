'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const versionPath = path.resolve('version.txt');

class ClientController extends Controller {
	async register() {
		const { service } = this.ctx;
		const versionTxt = fs.readFileSync(versionPath, 'utf8');
		await this.ctx.render('index.html', { random: versionTxt })
	}
	/**
	 * 登录
	 * @return {[type]} [description]
	 */
	async login() {
		const { service } = this.ctx;
		const { code, data = {} } = await service.v1.user.token();
		if(code === '0000'){
			this.ctx.redirect('/');
		}
		const versionTxt = fs.readFileSync(versionPath, 'utf8');
		await this.ctx.render('index.html', { random: versionTxt })
	}
	async index() {
		// console.log(this.ctx.params.id)
		const { service } = this.ctx;
		const { code, data } = await service.v1.user.userInfo();
		const versionTxt = fs.readFileSync(versionPath, 'utf8');
		await this.ctx.render('index.html', { random: versionTxt })
	}
	async reset() {
		this.ctx.redirect('/login');
	}
	async version() {
		const { service, query } = this.ctx;
		const { v = '1111' } = query;
		this.ctx.body = await service.common.version({ v });
	}
}

module.exports = ClientController;