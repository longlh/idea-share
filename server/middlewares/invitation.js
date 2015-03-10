'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');

var oauth = rek('server/libs/oauth-helper');
var conf = rek('env/profiles/all');

var self = module.exports;
var Profile = mongoose.model('Profile');
var Invitation = mongoose.model('Invitation');

function register(data, invitation) {
	var profile = new Profile(data);

	var registerProfile = bird.promisify(profile.save, profile);

	return registerProfile().spread(function registerDone(profile) {
		if (conf.consumeInvitation) {
			var query = Invitation.findByIdAndUpdate(invitation._id, {
				used: true
			});

			var consume = bird.promisify(query.exec, query);

			return consume();
		}

		return invitation;
	}).then(function cosumeDone(invitation) {
		return profile;
	});
}

function findInvitationByCode(code) {
	var query = Invitation.findOne({
		code: code,
		used: false
	});

	var find = bird.promisify(query.exec, query);

	return find().then(function done(invitation) {
		if (!invitation) {
			return bird.reject(new Error('Invitation not found'));
		}

		return invitation;
	});
}

function invalidInvitation(res, data, error) {
	if (error) {
		console.log(error);
	}

	return res._redirect('page.invitation', data);
}

self.render = function(req, res, next) {
	var code = req.params.code;
	var email = req.query.email;

	findInvitationByCode(code).then(function done(invitation) {
		if (email) {
			invitation.email = email;
		}

		res.render('auth/invitation', {
			invitation: invitation
		});
	}).catch(function handleError(error) {
		console.log(error);

		return res.render('auth/invitation', {
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

	findInvitationByCode(code).then(function done(invitation) {
		return register({
			accounts: [{
				kind: 'internal',
				uid: id,
				password: password
			}],
			public: {
				displayName: displayName,
				email: email
			}
		}, invitation);
	}).then(function registerDone(profile) {
		return res._redirect('auth.sign-in');
	}).catch(function handleError(error) {
		return invalidInvitation(res, {
			code: code,
			email: email
		}, error);
	});
};

self.googleConnect = function(req, res, next) {
	var code = req.params.code;

	findInvitationByCode(code).then(function done(invitation) {
		return oauth.google.requestInvite(code, req, res, next);
	}).catch(function handleError(error) {
		return invalidInvitation(res, {
			code: code
		}, error);
	});
};

self.googleConsumeInvitation = function(req, res, next) {
	var code = req.query.state;
	var consumingInvitation;

	findInvitationByCode(code).then(function done(invitation) {
		// store consuming invitation
		consumingInvitation = invitation;

		return oauth.google.handleInvite(req, res, next);
	}).then(function oauthDone(data) {
		if (data.profile) {
			return bird.reject(new Error('Dupplicate Google account'));
		}

		var ggProfile = data.oauth;

		if (!ggProfile) {
			return bird.reject(new Error('Google Profile not found'));
		}

		return register({
			accounts: [{
				kind: 'google',
				uid: ggProfile.id
			}],
			public: {
				displayName: ggProfile.displayName,
				email: ggProfile.emails[0] && ggProfile.emails[0].value,
				avatar: ggProfile.photos[0] && ggProfile.photos[0].value
			}
		}, consumingInvitation);
	}).then(function consumeDone(profile) {
		return res._redirect('auth.sign-in');
	}).catch(function handleError(error) {
		return invalidInvitation(res, {
			code: code
		}, error);
	});
};

self.facebookConnect = function(req, res, next) {
	var code = req.params.code;

	findInvitationByCode(code).then(function done(invitation) {
		return oauth.facebook.requestInvite(code, req, res, next);
	}).catch(function handleError(error) {
		return invalidInvitation(res, {
			code: code
		}, error);
	});
};

self.facebookConsumeInvitation = function(req, res, next) {
	var code = req.query.state;
	var consumingInvitation;

	findInvitationByCode(code).then(function done(invitation) {
		// store consuming invitation
		consumingInvitation = invitation;

		return oauth.facebook.handleInvite(req, res, next);
	}).then(function oauthDone(data) {
		if (data.profile) {
			return bird.reject(new Error('Dupplicate Facebook account'));
		}

		var fbProfile = data.oauth;

		if (!fbProfile) {
			return bird.reject(new Error('Facebook Profile not found'));
		}

		return register({
			accounts: [{
				kind: 'facebook',
				uid: fbProfile.id
			}],
			public: {
				displayName: fbProfile.displayName,
				email: fbProfile.emails[0] && fbProfile.emails[0].value,
				avatar: '//graph.facebook.com/' + fbProfile.id + '/picture?type=large'
			}
		}, consumingInvitation);
	}).then(function consumeDone(profile) {
		return res._redirect('auth.sign-in');
	}).catch(function handleError(error) {
		return invalidInvitation(res, {
			code: code
		}, error);
	});
};
