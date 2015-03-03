'use strict';

module.exports = {
	https: true,
	db: 'mongodb://localhost/indie-codes',
	oauth: {
		google: {
			clientId: '19650001560-pktpk190g880rkb5eh388t1peamj993b.apps.googleusercontent.com',
			clientSecret: 'C0jkAi4YG6RpgjrOb3lBDHnO',
			callback: 'https://indie.codes/oauth/google'
		}
	}
};
