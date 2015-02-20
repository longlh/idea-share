'use strict';

var bird = require('bluebird');
var mongoose = require('mongoose');
var redis = require('redis');
var uuid = require('node-uuid');

var Account = mongoose.model('Account');
var client = redis.createClient();
var self = module.exports;

// promisify
var rGet = bird.promisify(client.get, client);
var rSet = bird.promisify(client.set, client);
var rDel = bird.promisify(client.del, client);
var rExpire = bird.promisify(client.expire, client);

var enforceSession = function(token, account) {
	return rSet('session:' + token, account.id).then(function saveTokenDone(reply) {
		return rExpire('session:' + token, 60e3);
	}).then(function setTokenExpireDone(reply) {
		return {
			token: token,
			id: account.id
		};
	});
};

var findAccountBySessionToken = function(token) {
	return rGet('session:' + token).then(function getSessionDone(id) {
		if (id) {
			var query = Account.findById(id);
			var findAccount = bird.promisify(query.exec, query);

			return findAccount();
		}

		return bird.reject();
	});
};

self.identifySession = function(req, res, next) {
	var token = req.headers.authorization;

	return findAccountBySessionToken(token).then(function findAccountDone(account) {
		req._account = account;

		next();
	}).catch(function handleError(e) {
		res.status(401).json(e);
	});
};

self.validateSession = function(req, res, next) {
	var token = req.params.token;

	findAccountBySessionToken(token).then(function findAccountDone(account) {
		return enforceSession(token, account);
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
	var query = Account.findOne({
			email: req.body.email,
			enable: true
		});
	var findAccount = bird.promisify(query.exec, query);

	findAccount().then(function findAccountDone(account) {
		if (account && account.authenticate(req.body.password)) {
			var token = uuid.v4();

			return enforceSession(token, account);
		} else {
			return bird.reject();
		}
	}).then(function sessionEnforceDone(session) {
		res.json(session);
	}).catch(function handleError(e) {
		res.status(401).json(e);
	});
};
