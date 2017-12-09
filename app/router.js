'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  	const { router, controller } = app;
  	router.get('/test', controller.home.test);
  	router.get('/login', 'home.index');


	require('./router/client')(app);
  	require('./router/api')(app);
};
