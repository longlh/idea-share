;(function() {
	'use strict';
	// var COOKIE_KEY_TOKEN = 'token';

	var SessionFactory = function($cookieStore, ModelFactory, Storage) {

		var storeSession = function(response, session) {
			// store current session
			Storage.session = session;

			// store token in cookies
			$cookieStore.put(Session.class.KEY, Storage.session.token);

			return Storage.session;
		};

		var purgeSession = function(response, session) {
			// clear session
			Storage.session = null;

			// clear cookie
			$cookieStore.remove(Session.class.KEY);

			return response;
		};

		var Session = ModelFactory.model({
			resource: {
				path: '/api/sessions/:token',
				defaultParameters: {
					token: '@token'
				},
				methods: {
					get: {
						method: 'get',
						interceptor: {
							response: storeSession
						}
					},
					create: {
						method: 'post',
						interceptor: {
							response: storeSession
						}
					},
					delete: {
						method: 'delete',
						interceptor: {
							response: purgeSession
						}
					},
					query: false,
					save: false
				}
			}
		});

		Object.defineProperty(Session.class, 'KEY', {
			value: 'token'
		});

		return Session.class;
	};

	SessionFactory.$inject = [
		'$cookieStore',
		'app.share.services.ModelFactory', 'app.share.models.Storage'
	];

	angular.module('app.auth').factory('app.auth.models.Session', SessionFactory);
}());
