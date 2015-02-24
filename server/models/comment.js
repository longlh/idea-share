'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	content: {
		type: String,
		required: true
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'Account',
		required: true
	},
	idea: {
		type: Schema.ObjectId,
		ref: 'Idea',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	deleted: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Comment', commentSchema);
