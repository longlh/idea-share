'use strict';

var _ = require('lodash');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
	uid: {
		type: String,
		required: true
	},
	kind: {
		type: String,
		required: true
	},
	salt: String,
	hashedPassword: String
});

accountSchema.index({
	uid: 1,
	kind: -1
}, {
	unique: true,
	sparse: true
});

// methods
accountSchema.methods = {
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
	accounts: [accountSchema],
	enable: {
		type: Boolean,
		default: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

profileSchema.methods = {
	authenticate: function(password) {
		var internalAccount = _.find(this.accounts, {
			kind: 'internal'
		});

		return internalAccount && internalAccount.authenticate(password);
	}
};

mongoose.model('Profile', profileSchema);
