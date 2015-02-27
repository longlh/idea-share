'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var mongoose = require('mongoose');
var redis = require('redis');
var uuid = require('node-uuid');

var Profile = mongoose.model('Profile');
var client = redis.createClient();
var self = module.exports;

// promisify
var rGet = bird.promisify(client.get, client);
var rSet = bird.promisify(client.set, client);
var rDel = bird.promisify(client.del, client);
var rExpire = bird.promisify(client.expire, client);

var enforceSession = function(token, profile) {
	return rSet('session:' + token, profile.id).then(function saveTokenDone(reply) {
		return rExpire('session:' + token, 60e3);
	}).then(function setTokenExpireDone(reply) {
		return _.assign({
			token: token
		}, _.pick(profile, 'profile'));
	});
};

var findProfileBySessionToken = function(token) {
	return rGet('session:' + token).then(function getSessionDone(id) {
		if (id) {
			var query = Profile.findById(id);
			var findProfile = bird.promisify(query.exec, query);

			return findProfile();
		}

		return bird.reject();
	});
};

self.identifySession = function(req, res, next) {
	var token = req.headers.authorization;

	return findProfileBySessionToken(token).then(function findProfileDone(profile) {
		req._profile = profile;

		next();
	}).catch(function handleError(e) {
		res.status(401).json(e);
	});
};

self.validateSession = function(req, res, next) {
	var token = req.params.token;

	findProfileBySessionToken(token).then(function findProfileDone(profile) {
		return enforceSession(token, profile);
	}).then(function enforceSessionDone(session) {
		res.json(session);
	}).catch(function onError(e) {
		res.status(401).json(e);
	});
};

self.destroySession = function(req, res, next) {
	var token = req.params.token;

	rDel('session:' + token).finally(function done() {
		res.status(204).end();
	});
};

self.signIn = function(req, res, next) {
	var query = Profile.findOne({
			email: req.body.email,
			enable: true
		});
	var findProfile = bird.promisify(query.exec, query);

	findProfile().then(function findProfileDone(profile) {
		if (profile && profile.authenticate(req.body.password)) {
			var token = uuid.v4();

			return enforceSession(token, profile);
		} else {
			return bird.reject();
		}
	}).then(function sessionEnforceDone(session) {
		res.json(session);
	}).catch(function handleError(e) {
		res.status(401).json(e);
	});
};

self.renderSignIn = function(req, res, next) {
	res.render('auth/sign-in');
};
