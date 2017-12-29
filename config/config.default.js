'use strict';
const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1512037306429_9479';

	config.security = {
		csrf: {
			enable: false
		}
	}

	config.bodyParser = {
		enable: true,
	    encoding: 'utf8',
	    formLimit: '100kb',
	    jsonLimit: '100mb',
	    strict: true,
	    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
	    queryString: {
	      arrayLimit: 100,
	      depth: 5,
	      parameterLimit: 1000,
	    },
	}

	// 允许跨域携带cookie
	// config.cors = {
	// 	credentials: true
	// }

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
