'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	uid: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	kind: {
		type: String,
		required: true
	},
	salt: String,
	hashedPassword: String
});

// methods
accountSchema.methods = {
	makeSalt: function() {
		return crypto.randomBytes(1 << 4).toString('base64');
	},
	makeHashedPassword: function(password) {
		console.log(this.toObject());
		if (!password || !this.salt) {
			return '';
		}

		var salt = new Buffer(this.salt, 'base64');

		return crypto.pbkdf2Sync(password, salt, 1 << 10, 1 << 6).toString('base64');
	},
	authenticate: function(password) {
		return this.makeHashedPassword(password) === this.hashedPassword;
	}
};

// virtuals
accountSchema.virtual('password').set(function(password) {
	this.salt = this.makeSalt();
	this.hashedPassword = this.makeHashedPassword(password);
});

// schema
var profileSchema = new Schema({
	public: {
		displayName: {
			type: String,
			required: true
		},
		avatar: String
	},
	account: [accountSchema],
	enable: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Profile', profileSchema);
