
module.exports = app => {
	const { router, controller } = app;
	router.get('/token?token=45b2bee9-ed85-46fc-bc46-cfd1c6c09f9e', controller.user.token);
}