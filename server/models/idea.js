'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fragmentSchema = new Schema({
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
	},
	modified: {
		type: Date,
		default: Date.now
	}
});

fragmentSchema.set('toObject', {
	virtuals: true
});

fragmentSchema.virtual('createdUTC').get(function() {
	return this.created && this.created.valueOf();
});

fragmentSchema.virtual('modifiedUTC').get(function() {
	return this.modified && this.modified.valueOf();
});

var ideaSchema = new Schema({
	owner: {
		type: Schema.ObjectId,
		ref: 'Profile',
		required: true
	},
	brief: {
		type: String,
		required: true
	},
	fragments: [fragmentSchema],
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	}
});

ideaSchema.set('toObject', {
	virtuals: true
});

ideaSchema.virtual('createdUTC').get(function() {
	return this.created && this.created.valueOf();
});

ideaSchema.virtual('modifiedUTC').get(function() {
	return this.created && this.modified.valueOf();
});

ideaSchema.pre('save', function(next) {
	// update modified date
	this.modified = new Date();

	next();
});

mongoose.model('Idea', ideaSchema);
