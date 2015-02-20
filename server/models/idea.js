'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ideaFragmentSchema = new Schema({
	content: {
		type: String,
		required: true
	},
	ref: {
		type: Schema.ObjectId,
		ref: 'Comment'
	}
});

var ideaSchema = new Schema({
	owner: {
		type: Schema.ObjectId,
		ref: 'Account',
		// required: true
	},
	brief: {
		type: String,
		required: true
	},
	fragments: [ideaFragmentSchema],
	comments: [{
		type: Schema.ObjectId,
		ref: 'Comment'
	}]
});

mongoose.model('Idea', ideaSchema);
