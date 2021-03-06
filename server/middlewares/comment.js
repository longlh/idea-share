'use strict';

var _ = require('lodash');
var bird = require('bluebird');
var mongoose = require('mongoose');

var Comment = mongoose.model('Comment');
var self = module.exports;

function refineCommentObject(comment, profile) {
	return _.assign(comment.toObject(), {
		self: profile.id.toString() === comment.owner.toString() ||
				profile.id.toString() === comment.owner.id.toString()
	});
}

self.query = function(req, res, next) {
	var query = Comment.find({
		idea: req._idea.id
	}).sort('-created').populate('owner', 'public');

	var getComments = bird.promisify(query.exec, query);

	return getComments().then(function queryDone(comments) {
		return res.json(_.map(comments, function iterate(comment) {
			return refineCommentObject(comment, req._profile);
		}));
	});
};

self.save = function(req, res, next) {
	var comment = new Comment(_.pick(req.body, 'content'));

	comment.idea = req._idea.id;
	comment.owner = req._profile.id;

	var saveComment = bird.promisify(comment.save, comment);

	return saveComment().spread(function saveDone(comment) {
		return res.json(_.assign(refineCommentObject(comment, req._profile), {
			owner: _.pick(req._profile, '_id', 'public')
		}));
	});
};
