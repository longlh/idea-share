'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invitationSchema = new Schema({
	code: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	used: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	email: String,
	note: String
});

mongoose.model('Invitation', invitationSchema);
