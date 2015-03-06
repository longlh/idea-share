'use strict';

var bird = require('bluebird');
var passport = require('passport');

var oauth = rek('env/profiles/all').oauth;

function callback(error, data, info) {
	if (error) {
		return bird.reject(error);
	}

	if (data) {
		return bird.resolve(data);
	}

	return bird.reject(new Error('Profile not found'));
}

function handleGoogleOAuth(url) {
	return function(req, res, next) {
		return new bird.Promise(function promise(resolve, reject) {
			var signIn = passport.authenticate('google', {
				callbackURL: url
			}, function done(error, data, info) {
				resolve(callback(error, data, info));
			});

			signIn(req, res, next);
		});
	};
}

var self = module.exports;

self.internal = {};

self.internal.handleSignIn = function(req, res, next) {
	return new bird.Promise(function promise(resolve, reject) {
		return passport.authenticate('local', function(error, data, info) {
			resolve(callback(error, data, info));
		})(req, res, next);
	});
};

self.google = {};

self.google.requestSignIn = passport.authenticate('google', {
	scope: [
		'email',
		'profile'
	],
	callbackURL: oauth.google.signIn
});

self.google.handleSignIn = handleGoogleOAuth(oauth.google.signIn);

self.google.requestInvite = function(state, req, res, next) {
	var signIn = passport.authenticate('google', {
		scope: [
			'email',
			'profile'
		],
		state: state,
		callbackURL: oauth.google.acceptInvitation
	});

	return signIn(req, res, next);
};

self.google.handleInvite = handleGoogleOAuth(oauth.google.acceptInvitation);
