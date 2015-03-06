'use strict';

module.exports = {
	port: 80,
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
			signIn: 'http://localhost/oauth/google',
			acceptInvitation: 'http://localhost/oauth/google/invitation'
		},
		facebook: {
			appId: '1421098268186165',
			appSecret: 'd262165753515cfaa9b0c981a1a28dc3',
			signIn: 'http://localhost/oauth/facebook',
			acceptInvitation: 'http://localhost/oauth/facebook/invitation'
		}
	}
};
