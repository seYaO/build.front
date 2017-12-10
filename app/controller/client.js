'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const versionPath = path.resolve('version.txt');

class ClientController extends Controller {
	async index() {
		const { cookies } = this.ctx;
		const versionTxt = fs.readFileSync(versionPath, 'utf8');
		// this.ctx.cookies.set('token', '45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e')
		// this.ctx.body = await this.ctx.renderView('index.html')
		await this.ctx.render('index.html', { random: versionTxt })
	}
	async version() {
		const { service, query } = this.ctx;
		const { v = '1111' } = query;
		this.ctx.body = await service.common.version({ v });
	}
}

module.exports = ClientController;