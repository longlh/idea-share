'use strict';

module.exports = {
	db: 'mongodb://localhost/indie-codes-dev',
	mail: {
		sender: 'no-reply@indie.codes',
		region: 'us-west-2',
		accessKeyId: '',
		secretAccessKey: ''
	},
	consumeInvitation: false,
	oauth: {
		google: {
			clientId: '19650001560-pktpk190g880rkb5eh388t1peamj993b.apps.googleusercontent.com',
			clientSecret: 'C0jkAi4YG6RpgjrOb3lBDHnO',
			callback: 'http://localhost:3002/oauth/google'
		}
	}
};
