'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');

var conf = rek('env/profiles/all');
var passport = rek('server/libs/passport');

var oauth = conf.oauth;
var self = module.exports;
var Profile = mongoose.model('Profile');
var Invitation = mongoose.model('Invitation');

function findInvitation(code) {
	var query = Invitation.findOne({
			code: code,
			used: false
		});

	return bird.promisify(query.exec, query)();
}

self.render = function(req, res, next) {
	var code = req.params.code;
	var email = req.query.email;

	findInvitation(code).then(function findInvitationDone(invitation) {
		if (!invitation) {
			return bird.reject();
		}

		if (email) {
			invitation.email = email;
		}

		res.render('auth/invitation', {
			invitation: invitation
		});
	}).catch(function handleError(error) {
		res.render('auth/invitation', {
			error: error
		});
	});
};

self.consumeInvitation = function(req, res, next) {
	var code = req.body.code;
	var id = req.body.id;
	var email = req.body.email;
	var password = req.body.password;
	var displayName = req.body.displayName || email || id;
	var usingInvitation;

	findInvitation(code).then(function findInvitationDone(invitation) {
		// invitation is matched with code and not used yet
		if (invitation) {
			var profile = new Profile({
				accounts: [{
					kind: 'internal',
					uid: id,
					password: password
				}],
				public: {
					displayName: displayName,
					email: email
				}
			});

			var createProfile = bird.promisify(profile.save, profile);

			// store working invitation
			usingInvitation = invitation;

			return createProfile();
		}

		return bird.reject();

	}).spread(function createProfileDone() {
		var consumeInvitation = bird.promisify(usingInvitation.save, usingInvitation);

		if (conf.consumeInvitation) {
			usingInvitation.used = true;
		}

		return consumeInvitation();
	}).spread(function consumeInvitationDone() {
		res._redirect('auth.sign-in');
	}).catch(function handleError(error) {
		console.log(error);

		res._redirect('page.invitation', {
			code: code,
			email: email
		});
	});
};

self.googleConnect = function(req, res, next) {
	var code = req.params.code;

	findInvitation(code).then(function findInvitationDone(invitation) {
		if (!invitation) {
			return bird.reject();
		}

		return passport.authenticate('google', {
			scope: [
				'email',
				'profile'
			],
			state: invitation.code,
			callbackURL: oauth.google.acceptInvitation
		})(req, res, next);
	}).catch(function handleError(error) {
		console.log(error);

		res._redirect('page.invitation', {
			code: code
		});
	});
};

self.googleConsumeInvitation = function(req, res, next) {
	var code = req.query.state;
	var usingInvitation;

	findInvitation(code).then(function findInvitationDone(invitation) {
		if (!invitation) {
			return bird.reject();
		}

		usingInvitation = invitation;

		return new bird.Promise(function promise(resolve, reject) {
			passport.authenticate('google', {
				callbackURL: oauth.google.acceptInvitation
			}, function(err, result, info) {
				if (err || !result) {
					return reject(err || result);
				}

				return resolve(result);
			})(req, res, next);
		});
	}).then(function oauthDone(result) {
		if (result.profile) {
			return bird.reject(new Error('Dupplicate Google account'));
		}

		var profile = new Profile({
			accounts: [{
				kind: 'google',
				uid: result.oauth.id
			}],
			public: {
				displayName: result.oauth.displayName,
				email: result.oauth.emails[0].value
			}
		});

		var createProfile = bird.promisify(profile.save, profile);

		return createProfile();
	}).spread(function createProfileDone() {
		var consumeInvitation = bird.promisify(usingInvitation.save, usingInvitation);

		if (conf.consumeInvitation) {
			usingInvitation.used = true;
		}

		return consumeInvitation();
	}).spread(function consumeInvitationDone() {
		res._redirect('auth.sign-in');
	}).catch(function handleError(error) {
		console.log(error);

		res._redirect('page.invitation', {
			code: code
		});
	});
};
