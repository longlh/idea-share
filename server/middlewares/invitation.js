'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');

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

self.process = function(req, res, next) {
	var code = req.params.code;
	var email = req.body.email;
	var password = req.body.password;
	var displayName = req.body.displayName || email;
	var usingInvitation;

	findInvitation(code).then(function findInvitationDone(invitation) {
		// invitation is matched with code and not used yet
		if (invitation) {
			var profile = new Profile({
					email: email,
					password: password,
					public: {
						displayName: displayName
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

		usingInvitation.used = true;

		return consumeInvitation();
	}).spread(function consumeInvitationDone() {
		res._redirect('page.index');
	}).catch(function handleError(error) {
		res._redirect('page.invitation', {
			code: code,
			email: email
		});
	});
};
