'use strict';

var bird = require('bluebird'),
	mongoose = require('mongoose');


var self = module.exports,
	Account = mongoose.model('Account'),
	Invitation = mongoose.model('Invitation');

function findInvitation(code) {
	var query = Invitation.findOne({
			code: code,
			used: false
		});

	return bird.promisify(query.exec, query)();
}

self.render = function(req, res, next) {

	var code = req.params.code,
		email = req.query.email;

	findInvitation(code).then(function findInvitationDone(invitation) {
		if (!invitation) {
			return bird.reject();
		}

		if (email) {
			invitation.email = email;
		}

		res.render('invitation', {
			invitation: invitation
		});
	}).catch(function handleError(error) {
		res.render('invitation', {
			error: error
		});
	});

};

self.process = function(req, res, next) {

	var code = req.params.code,
		email = req.body.email,
		password = req.body.password,
		usingInvitation;

	findInvitation(code).then(function findInvitationDone(invitation) {

		// invitation is matched with code and not used yet
		if (invitation) {
			// store working invitation
			usingInvitation = invitation;

			var account = new Account({
					email: email,
					password: password
				}),
				createAccount = bird.promisify(account.save, account);

			return createAccount();
		}

		return bird.reject();

	}).spread(function createAccountDone() {

		var consumeInvitation = bird.promisify(usingInvitation.save, usingInvitation);

		usingInvitation.used = true;

		return consumeInvitation();

	}).spread(function consumeInvitationDone() {

		res._redirect('page.index');

	}).catch(function handleError(error) {

		console.info(error);

		res._redirect('page.invitation', {
			code: code,
			email: email
		});

	});
};