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

	app._route('page.invitation', '/auth/invitation/:code?')
			.get(invitation.render)
			.post(invitation.consumeInvitation);

	app._route('page.invitation.google', '/auth/invitation/google/:code')
			.get(invitation.googleConnect);

	app.get('/oauth/google/invitation', invitation.googleConsumeInvitation);

	app._route('page.invitation.facebook', '/auth/invitation/facebook/:code')
			.get(invitation.facebookConnect);

	app.get('/oauth/facebook/invitation', invitation.facebookConsumeInvitation);

	app._route('auth.sign-in', '/auth/sign-in')
			.get(auth.renderSignIn)
			.post(auth.internalSignIn);

	app._route('auth.sign-in.google', '/auth/connect/google')
			.get(auth.googleConnect);

	app.get('/oauth/google', auth.googleSignIn);

	app._route('auth.sign-in.facebook', '/auth/connect/facebook')
			.get(auth.facebookConnect);

	app.get('/oauth/facebook', auth.facebookSignIn);

	app._route('auth.sign-out', '/auth/sign-out')
			.get(auth.signOut);
};
