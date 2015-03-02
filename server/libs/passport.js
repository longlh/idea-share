'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var Profile = mongoose.model('Profile');

// export
module.exports = passport;

passport.serializeUser(function serialize(user, done) {
	done(null, user._id);
});

passport.deserializeUser(Profile.findById.bind(Profile));

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
		if (!profile) {
			return console.log('no profile found');
		} else if (!profile.enable) {
			return console.log('profile is disabled');
		} else if (!profile.authenticate(password)) {
			return console.log('incorrect password');
		}

		done(null, profile);
	}).catch(function handleError(error) {
		done(error);
	});
}));
