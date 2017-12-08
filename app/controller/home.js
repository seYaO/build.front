'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // const result = await app.curl('https://registry.npm.taobao.org/egg/latest', {
    //     dataType: 'json',
    //   });
    this.ctx.body = 'hi, egg';
  }

  async search() {
  	const { query } = this.ctx;
  	let { name = 'null' } = query;
  	this.ctx.body = `search: ${name}`
  }

  async user() {
  	const { params } = this.ctx;
  	let { id = 'null', name = 'null' } = params;
  	this.ctx.body = `user: ${id}, ${name}`
  }
}

module.exports = HomeController;
