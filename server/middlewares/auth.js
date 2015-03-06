'use strict';

var bird = require('bluebird');

var oauth = rek('server/libs/oauth-helper');

function signInFailed(req, res, err) {
	console.log(err);

	return res._redirect('auth.sign-in');
}

function signIn(req, res, profile) {
	return req.logIn(profile, function(err) {
		if (err) {
			return signInFailed(req, res, err);
		}

		return res._redirect('page.landing');
	});
}

var self = module.exports;

self.renderSignIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return res._redirect('page.landing');
	}

	res.render('auth/sign-in');
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

self.internalSignIn = function(req, res, next) {
	return oauth.internal.handleSignIn(req, res, next).then(function done(profile) {
		return signIn(req, res, profile);
	}).catch(function handleError(err) {
		signInFailed(req, res, err);
	});
};

self.googleConnect = oauth.google.requestSignIn;

self.googleSignIn = function(req, res, next) {
	return oauth.google.handleSignIn(req, res, next).then(function done(data) {
		return data.profile ?
				data.profile : bird.reject(new Error('Profile not found'));
	}).then(function done(profile) {
		return signIn(req, res, profile);
	}).catch(function handleError(err) {
		signInFailed(req, res, err);
	});
};
