'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var mongoose = require('mongoose');

var self = module.exports;
var Idea = mongoose.model('Idea');

self.get = function(options) {
	return function(req, res, next) {
		var id = req.params[options.identifier];
		var query = Idea.findById(id).populate('owner', 'email enable');
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
	var job;

	if (req._idea) {
		var modifiedData = _.pick(req.body, 'brief', 'fragments');
		var query = Idea.findByIdAndUpdate(req._idea._id, modifiedData);
		var updateIdea = bird.promisify(query.exec, query);

		job = updateIdea();
	} else {
		// set idea's owner is logged-in account
		var idea = new Idea(req.body);
		var insertIdea = bird.promisify(idea.save, idea);
		idea.owner = req._account.id;

		job = insertIdea().spread(function insertIdeaDone(idea) {
			return idea;
		});
	}

	job.then(function saveDone(idea) {
		return res.json(_.omit(idea, 'comments'));
	}).catch(function handleError(e) {
		res.status(500).json(e);
	});
};

// fragments operations
function updateExistedFragment(req, res, id) {
	// update
	var query = Idea.findOneAndUpdate({
		_id: req._idea._id,
		'fragments._id': id
	}, {
		$set: {
			'fragments.$.content': req.body.content
		}
	}, {
		select: ['fragments']
	});

	var saveFragment = bird.promisify(query.exec, query);

	return saveFragment().then(function saveFragmentDone(idea) {
		return res.json(idea.fragments.id(id));
	});
}

function insertFragment(req, res) {
	var query = Idea.findByIdAndUpdate(req._idea._id, {
		$push: {
			fragments: {
				content: req.body.content
			}
		}
	}, {
		select: ['fragments']
	});

	var saveFragment = bird.promisify(query.exec, query);

	return saveFragment().then(function saveFragmentDone(idea) {
		return res.json(idea.fragments.pop());
	});
}

self.saveFragment = function(req, res, next) {
	var id = req.params.id;
	var job = id ? updateExistedFragment : insertFragment;

	job(req, res, id).catch(function handleError(e) {
		res.status(500).json(e);
	});
};

self.deleteFragment = function(req, res, next) {
	var id = req.params.id;
	// update
	var query = Idea.findOneAndUpdate({
		_id: req._idea._id,
		'fragments._id': id
	}, {
		$set: {
			'fragments.$.deleted': true
		}
	}, {
		select: ['fragments']
	});

	var deleteFragment = bird.promisify(query.exec, query);

	return deleteFragment().then(function deleteFragmentDone(idea) {
		return res.json(idea.fragments.id(id));
	});
};

self.getFragment = function(req, res, next) {
	res.json(req._idea.fragments.id(req.params.id));
};
