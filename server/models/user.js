'use strict';

var crypto = require('crypto'),
	mongoose = require('mongoose');

// schema
var UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	enable: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	salt: String
});

// methods
UserSchema.methods = {
	makeSalt: function() {
		return crypto.randomBytes(1 << 4).toString('base64');
	},
	makeHashedPassword: function(password) {
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
UserSchema.virtual('password').set(function(password) {
	this.salt = this.makeSalt();
	this.hashedPassword = this.makeHashedPassword(password);
});


mongoose.model('User', UserSchema);