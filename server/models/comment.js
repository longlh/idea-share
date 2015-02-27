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
		ref: 'Profile',
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

commentSchema.set('toObject', {
	virtuals: true
});

commentSchema.virtual('createdUTC').get(function() {
	return this.created.valueOf();
});

mongoose.model('Comment', commentSchema);
