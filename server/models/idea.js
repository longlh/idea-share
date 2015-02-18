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
		ref: 'IdeaComment'
	}
});

var ideaSchema = new Schema({
	accountId: {
		type: Schema.ObjectId,
		ref: 'Account',
		required: true
	},
	fragments: [ideaFragmentSchema]
});

mongoose.model('Idea', ideaSchema);
