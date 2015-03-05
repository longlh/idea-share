'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');
var passport = require('passport');

var oauth = rek('env/profiles/all').oauth;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var Profile = mongoose.model('Profile');

// export
module.exports = passport;

passport.serializeUser(function serialize(user, done) {
	done(null, user._id);
});

passport.deserializeUser(Profile.findById.bind(Profile));

// google oauth strategy
passport.use(new GoogleStrategy({
	clientID: oauth.google.clientId,
	clientSecret: oauth.google.clientSecret
}, function(accessToken, refreshToken, oauth, done) {
	var findProfile;

	if (oauth) {
		var query = Profile.where({
			'accounts.kind': 'google',
			'accounts.uid': oauth.id
		}).findOne();

		findProfile = bird.promisify(query.exec, query);
	} else {
		findProfile = bird.reject(new Error());
	}

	return findProfile().then(function findProfileDone(profile) {
		done(null, {
			profile: profile,
			oauth: oauth
		});
	}).catch(done);
}));

// local strategy
passport.use(new LocalStrategy({
	usernameField: 'id',
	passwordField: 'password'
}, function config(uid, password, done) {
	var query = Profile.where({
		'accounts.kind': 'internal',
		'accounts.uid': uid
	}).findOne();

	var findProfile = bird.promisify(query.exec, query);

	return findProfile().then(function findProfileDone(profile) {
		var error;

		if (!profile) {
			error = new Error('No profile found');
		} else if (!profile.enable) {
			error = new Error('Profile is disabled');
		} else if (!profile.authenticate(password)) {
			error = new Error('incorrect password');
		}

		done(error, profile);
	}).catch(done);
}));
