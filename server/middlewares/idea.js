'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var mongoose = require('mongoose');

var self = module.exports;
var Idea = mongoose.model('Idea');

function checkIdeaEditable(idea, account) {
	return account && idea && idea.owner &&
			(idea.owner.toString() === account._id.toString() ||
			idea.owner._id.toString() === account._id.toString());
}

function refineIdeaObject(idea, account) {
	return _.assign(idea.toObject(), {
		editable: checkIdeaEditable(idea, account)
	});
}

self.get = function(options) {
	return function(req, res, next) {
		var id = req.params[options.identifier];
		var query = Idea.findById(id).populate('owner', 'profile');
		var getIdea = bird.promisify(query.exec, query);

		return getIdea().then(function(idea) {
			if (options.finally) {
				return res.json(refineIdeaObject(idea, req._account));
			}

			req._idea = idea;

			return next();
		});
	};
};

self.query = function(req, res, next) {
	// TODO add search criteria
	var query = Idea.find().populate('owner', 'email enable');
	var getIdeas = bird.promisify(query.exec, query);

	return getIdeas().then(function getIdeasDone(ideas) {
		return res.json(_.map(ideas, function iterate(idea) {
			return refineIdeaObject(idea, req._account);
		}));
	});
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

	return job.then(function saveDone(idea) {
		return res.json(refineIdeaObject(idea, req._account));
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
			'fragments.$.content': req.body.content,
			'fragments.$.modified': new Date()
		}
	}, {
		select: ['fragments']
	});

	var saveFragment = bird.promisify(query.exec, query);

	return saveFragment().then(function saveFragmentDone(idea) {
		return res.json(idea.fragments.id(id).toObject());
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

	return job(req, res, id).catch(function handleError(e) {
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
	return res.json(req._idea.fragments.id(req.params.id).toObject());
};
