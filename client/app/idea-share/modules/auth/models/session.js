;(function() {
	'use strict';
	// var COOKIE_KEY_TOKEN = 'token';

	var SessionFactory = function($cookieStore, ModelFactory, Storage) {

		var storeSession = {
			response: function(response, session) {
				// store current session
				Storage.session = session;

				// store token in cookies
				$cookieStore.put(Session.KEY, Storage.session.token);

				return Storage.session;
			}
		};

		var purgeSession = {
			response: function(response, session) {
				// clear session
				Storage.session = null;

				// clear cookie
				$cookieStore.remove(Session.KEY);

				return response;
			}
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
						interceptor: storeSession
					},
					create: {
						method: 'post',
						interceptor: storeSession
					},
					delete: {
						method: 'delete',
						interceptor: purgeSession
					},
					query: false,
					save: false
				}
			}
		});

		Object.defineProperty(Session, 'KEY', {
			value: 'token'
		});

		return Session;
	};

	SessionFactory.$inject = [
		'$cookieStore',
		'app.share.services.ModelFactory', 'app.share.models.Storage'
	];

	angular.module('app.auth').factory('app.auth.models.Session', SessionFactory);
}());
