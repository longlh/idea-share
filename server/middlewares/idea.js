'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var mongoose = require('mongoose');

var self = module.exports;
var Idea = mongoose.model('Idea');

self.get = function(options) {
	return function(req, res, next) {
		var id = req.params[options.identifier];
		var query = Idea.findById(id).populate('owner');
		var getIdea = bird.promisify(query.exec, query);

		getIdea().then(function(idea) {
			if (options.finally) {
				return res.json(idea);
			}

			req._idea = idea;
			next();
		});
	};
};

self.save = function(req, res, next) {
	if (req._idea) {
		var modifiedData = _.pick(req.body, 'brief');
		var query = Idea.findByIdAndUpdate(req._idea.id, modifiedData);
		var updateIdea = bird.promisify(query.exec, query);

		updateIdea().then(function(idea) {
			res.json(idea);
		});
	} else {
		// set idea's owner is logged-in account
		var idea = new Idea(req.body);
		var insertIdea = bird.promisify(idea.save, idea);
		idea.owner = req._account.id;

		insertIdea().spread(function(idea) {
			res.json(idea);
		});
	}
};
