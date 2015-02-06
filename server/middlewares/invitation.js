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

	var code = req.params.code;

	findInvitation(code).then(function findInvitationDone(invitation) {
		if (!invitation) {
			return bird.reject();
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

	var code = req.params.code;

	findInvitation(code).then(function findInvitationDone(invitation) {

		if (!invitation.used) {
			// set invitation is used
			invitation.used = true;

			var account = new Account({
					email: req.body.email,
					password: req.body.password
				}),
				createAccount = bird.promisify(account.save, account),
				useInvitation = bird.promisify(invitation.save, invitation);

			return bird.all([
				useInvitation(),
				createAccount()
			]);
		}

		return bird.reject();

	}).then(function createAccountDone() {

		res._redirect('page.index');

	}).catch(function handleError(error) {

		res._redirect('page.invitation', {
			code: code
		});

	});
};