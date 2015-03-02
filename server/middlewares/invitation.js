'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');
var conf = rek('env/profiles/all');

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
	var code = req.params.code;
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
		// res._redirect('page.index');
		res._redirect('page.invitation', {
			code: code,
			email: email
		});
	}).catch(function handleError(error) {
		res._redirect('page.invitation', {
			code: code,
			email: email
		});
	});
};
