'use strict';

var auth = rek('server/middlewares/auth');
var invitation = rek('server/middlewares/invitation');

module.exports = function(app) {
	app._route('page.index', '/').get(function render(req, res, next) {
		res._redirect('auth.sign-in');
	});

	app._route('page.invitation', '/invitation/:code')
			.get(invitation.render)
			.post(invitation.process);

	app._route('auth.sign-in', '/auth/sign-in')
			.get(auth.renderSignIn);
};
