'use strict';

const Controller = require('egg').Controller;

class ClientController extends Controller {
	async index() {
		this.ctx.body = await this.ctx.renderView('index.html')
	}
}

module.exports = ClientController;