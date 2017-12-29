module.exports = appInfo => {
	const config = exports = {};

	config.apiServer = 'http://bx.17usoft.net/apigetway/handler';

	// errorHandler 错误提示
	config.middleware = ['errorHandler'];
	console.log('prod')
	return config;
};