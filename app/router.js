'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  	const { router, controller } = app;
  	// router.get('/test', 'v1.test.index');
  	// router.get('/login', 'home.index');

  	router.get('/version', 'client.version'); // 修改页面随机数
	require('./router/client')(app);
  	require('./router/api')(app);
  	require('./router/v1')(app);
};
