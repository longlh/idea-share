'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	comment: {
		type: String,
		required: true
	}
});

mongoose.model('Comment', commentSchema);
