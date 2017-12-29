/**
 * api
 */

const { Controller } = require('egg');
const url = require('url');

class ApiController extends Controller {
	/**
	 * 下载文件"
	 * @return {[type]} [description]
	 */
	async download() {
		let _url = "https://www.t.ly.com/baoxian/download/elecPolicy/6a4a3119566b038b7c1476f5b6a04cdfaee051cba0c1ff6c23d04d4df89545b3f77e8985b890f6c3a3d31b9f9282bce7";
		const { service, query } = this.ctx;
		const { name = '测试', uri = '' } = query;
		this.ctx.set('Content-Type', 'application/octet-stream;charset=utf-8');
		this.ctx.set('Content-Disposition', 'attachment; filename=' + new Buffer(`${name}.pdf`).toString('binary'));
		let href = url.parse(uri);
		this.ctx.body = await service.common.downLoad({ url: `https://${href.host}${href.path}` });
	}
	/**
	 * 测试服务地址
	 * @return {[type]} [description]
	 */
	async testApiServer() {
		this.ctx.body = `apiServer: ${this.config.apiServer}`;
	}
}

module.exports = ApiController;