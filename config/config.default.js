'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512037306429_9479';

  config.apiServer = 'http://bx.17usoft.net/apigetway/handler';

  // add your config here
  // 在配置文件中引入中间件
  config.middleware = ['saveSession'];

  // config.middleware = ['saveSession', 'errorHandler'];

  return config;
};
