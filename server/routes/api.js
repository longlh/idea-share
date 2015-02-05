'use strict';

var auth = rek('server/middlewares/auth');

module.exports = function(app) {
	app.route('/api/sessions')
			.post(auth.signIn);

	app.route('/api/sessions/:token')
			.get(auth.validateSession)
			.delete(function destroy(req, res, next) {

				res.status(204).end();

			});
};