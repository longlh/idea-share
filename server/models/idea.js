'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ideaSchema = new Schema({
	owner: {
		type: Schema.ObjectId,
		ref: 'Account',
		required: true
	},
	brief: {
		type: String,
		required: true
	},
	fragments: [{
		content: {
			type: String,
			required: true
		},
		ref: {
			type: Schema.ObjectId,
			ref: 'Comment'
		},
		deleted: {
			type: Boolean,
			default: false
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Idea', ideaSchema);
