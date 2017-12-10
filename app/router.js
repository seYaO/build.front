'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  	const { router, controller } = app;
  	// router.get('/test', 'client.test');
  	router.get('/login', 'home.index');

  	router.get('/version', 'client.version'); // 修改页面随机数
	require('./router/client')(app);
  	require('./router/api')(app);
};
