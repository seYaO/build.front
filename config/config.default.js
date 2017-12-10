'use strict';
const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1512037306429_9479';

	config.api = {
		APIV1: '/api/v1',
		APIV2: '/api/v2'
	}

	// 设置文件
	config.siteFile = {
		'/favicon.ico': fs.readFileSync(path.join(__dirname, 'favicon.ico')),
	}

	// 模版渲染
	config.view = {
		defaultViewEngine: 'nunjucks',
		mapping: {
			'.tpl': 'nunjucks',
		}
	}

	// add your config here
	// 在配置文件中引入中间件
	config.middleware = ['saveSession'];

	// config.middleware = ['saveSession', 'errorHandler'];

	return config;
};
