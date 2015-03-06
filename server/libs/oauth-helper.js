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

function handleOAuth(type, url) {
	return function(req, res, next) {
		return new bird.Promise(function promise(resolve, reject) {
			var signIn = passport.authenticate(type, {
				callbackURL: url
			}, function done(error, data, info) {
				resolve(callback(error, data, info));
			});

			signIn(req, res, next);
		});
	};
}

var self = module.exports;

/**
 *	INTERNAL
 **/

self.internal = {};

self.internal.handleSignIn = function(req, res, next) {
	return new bird.Promise(function promise(resolve, reject) {
		return passport.authenticate('local', function(error, data, info) {
			resolve(callback(error, data, info));
		})(req, res, next);
	});
};

/**
 *	GOOGLE
 **/

self.google = {};

self.google.requestSignIn = passport.authenticate('google', {
	scope: [
		'email',
		'profile'
	],
	callbackURL: oauth.google.signIn
});

self.google.handleSignIn = handleOAuth('google', oauth.google.signIn);

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

self.google.handleInvite = handleOAuth('google', oauth.google.acceptInvitation);

/**
 *	FACEBOOK
 **/

 self.facebook = {};

 self.facebook.requestSignIn = passport.authenticate('facebook', {
	scope: [
		'email'
	],
	callbackURL: oauth.facebook.signIn
});

 self.facebook.handleSignIn = handleOAuth('facebook', oauth.facebook.signIn);

 self.facebook.requestInvite = function(state, req, res, next) {
	var signIn = passport.authenticate('facebook', {
		scope: [
			'email'
		],
		state: state,
		callbackURL: oauth.facebook.acceptInvitation
	});

	return signIn(req, res, next);
};

self.facebook.handleInvite = handleOAuth('facebook', oauth.facebook.acceptInvitation);
