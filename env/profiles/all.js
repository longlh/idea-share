'use strict';

var _ = require('lodash');
var path = require('path');
var profiles = ['development', 'test', 'production'];
var env = process.env.NODE_ENV;

if (profiles.indexOf(env) === -1) {
	env = 'development';
}

var all = {
		https: false,
		port: 3002,
		env: env,
		cosumeInvitation: true,
		session: {
			key: '_^_^__mln',
			secret: 'nlm__^_^_',
			maxAge: 3600e3 // 1 hour
		}
	};

var profile = require(path.resolve(__dirname, env));

module.exports = _.assign(all, profile);
