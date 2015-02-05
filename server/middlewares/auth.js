'use strict';

var bird = require('bluebird'),
	mongoose = require('mongoose'),
	redis = require('redis'),
	uuid = require('node-uuid');

var User = mongoose.model('User'),
	client = redis.createClient(),
	self = module.exports;

// promisify
var rGet = bird.promisify(client.get, client),
	rSet = bird.promisify(client.set, client),
	rExpire = bird.promisify(client.expire, client);

var enforceSession = function(token, user) {

	return rSet('session:' + token, user.id).then(function saveTokenDone(reply) {

		return rExpire('session:' + token, 60e3);

	}).then(function setTokenExpireDone(reply) {

		return {
			token: token,
			id: user.id
		};

	});

};

self.validateSession = function(req, res, next) {

	var token = req.params.token;

	rGet('session:' + token).then(function(id) {

		if (id) {
			var query = User.findById(id),
				findUser = bird.promisify(query.exec, query);

			return findUser();
		}

		return bird.reject();

	}).then(function findUserDone(user) {

		return enforceSession(token, user);

	}).then(function enforceSessionDone(session) {

		res.json(session);

	}).catch(function onError(e) {

		res.status(401).json(e);

	});

};

self.signIn = function(req, res, next) {

	var query = User.findOne({
			email: req.body.email,
			enable: true
		}),
		findUser = bird.promisify(query.exec, query);

	findUser().then(function findUserDone(user) {
		// if (user) {
		// 	return [ user ];
		// }

		// user = new User();
		// user.email = req.body.email;
		// user.password = req.body.password;

		// console.log(user);

		// var save = bird.promisify(user.save, user);

		// return save();
	// }).then(function onSuccess(results) {
	// 	var user = results[0];

		if (user && user.authenticate(req.body.password)) {
			var token = uuid.v4();

			return enforceSession(token, user);
		} else {
			return bird.reject();
		}

	}).then(function sessionEnforceDone(session) {

		res.json(session);

	}).catch(function onError(e) {

		res.status(401).json(e);

	});

};