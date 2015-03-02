'use strict';

var auth = rek('server/middlewares/auth');
var innovation = rek('server/middlewares/innovation');
var invitation = rek('server/middlewares/invitation');

module.exports = function(app, passport) {
	app._route('page.landing', '/').get(function render(req, res, next) {
		res._redirect('app.innovation');
	});

	app._route('app.innovation', '/innovation')
			.get(auth.requireSignIn, innovation.render);

	app._route('page.invitation', '/auth/invitation/:code')
			.get(invitation.render)
			.post(invitation.consumeInvitation);

	app._route('auth.sign-in', '/auth/sign-in')
			.get(auth.renderSignIn)
			.post(auth.internalSignIn);

	app._route('auth.sign-out', '/auth/sign-out')
			.get(auth.signOut);
};
