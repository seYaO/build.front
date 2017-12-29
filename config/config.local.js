module.exports = appInfo => {
	const config = exports = {};

	// config.useMock = true; // 是否使用本地mock数据
	// config.apiServer = 'http://10.101.48.16:9001/apigetway/handler';
	config.apiServer = 'http://bx.qa.17usoft.net/apigetway/handler';
	// config.apiServer = 'http://bx.t.17usoft.net/apigetway/handler';
	// config.apiServer = 'http://bx.17usoft.net/apigetway/handler';
	// console.log(appInfo)

	return config;
};