'use strict';

var passport = rek('server/libs/passport');
var oauth = rek('env/profiles/all').oauth;

var self = module.exports;

self.renderSignIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return res._redirect('page.landing');
	}

	res.render('auth/sign-in');
};

self.internalSignIn = function(req, res, next) {
	return passport.authenticate('local', function(err, profile, info) {
		if (profile) {
			return req.logIn(profile, function(err) {
				res._redirect('page.landing');
			});
		}

		res._redirect('auth.sign-in');
	})(req, res, next);
};

self.requireSignIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res._redirect('auth.sign-in');
};

self.signOut = function(req, res, next) {
	req.logout();

	res._redirect('auth.sign-in');
};

self.googleSignIn = passport.authenticate('google', {
	scope: [
		'email',
		'profile'
	],
	callbackURL: oauth.google.signIn
});

self.googleCallback = function(req, res, next) {

};
