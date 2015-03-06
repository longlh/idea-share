'use strict';

module.exports = {
	https: true,
	db: 'mongodb://localhost/indie-codes',
	oauth: {
		google: {
			clientId: '19650001560-pktpk190g880rkb5eh388t1peamj993b.apps.googleusercontent.com',
			clientSecret: 'C0jkAi4YG6RpgjrOb3lBDHnO',
			callback: 'https://indie.codes/oauth/google'
		},
		facebook: {
			appId: '1421074651521860',
			appSecret: '20dabd8331d2c2c794670e198d20201b',
			signIn: 'https://indie.codes/oauth/facebook',
			acceptInvitation: 'http://indie.codes/oauth/facebook/invitation'
		}
	}
};
