module.exports = appInfo => {
	const config = exports = {};

	// config.useMock = true; // 是否使用本地mock数据
	config.apiServer = 'http://bx.17usoft.net/apigetway/handler';
	// console.log(appInfo)

	return config;
};