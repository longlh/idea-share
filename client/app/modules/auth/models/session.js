;(function () {
	'use strict';
	// var COOKIE_KEY_TOKEN = 'token';

	var SessionFactory = function($cookieStore, $resource, Storage) {

		var interceptor = {
			response: function(response) {
				// store current session
				Storage.session = response.resource;

				// store token in cookies
				$cookieStore.put(Session.KEY, Storage.session.token);

				return Storage.session;
			}
		};

		var Session = $resource('/api/sessions/:token', {
			token: '@token'
		}, {
			create: {
				method: 'post',
				interceptor: interceptor
			},
			destroy: {
				method: 'delete',
				interceptor: {
					response: function(response) {
						// clear session
						Storage.session = null;

						// clear cookie
						$cookieStore.remove(Session.KEY);

						return response;
					}
				}
			},
			validate: {
				method: 'get',
				interceptor: interceptor
			}
		});

		// Object.defineProperty(Session, 'current', {
		// 	get: function() {
		// 		if (_session) {
		// 			return _session;
		// 		} else if ($cookieStore.get(COOKIE_KEY_TOKEN)) {
		// 			// get session from cookie
		// 			return new Session({
		// 				token: $cookieStore.get(COOKIE_KEY_TOKEN)
		// 			});
		// 		}
		// 	}
		// });

		Object.defineProperty(Session, 'KEY', {
			value: 'token'
		});

		return Session;
	};

	SessionFactory.$inject = [ '$cookieStore', '$resource', 'app.share.models.Storage' ];

	angular.module('app.auth').factory('app.auth.models.Session', SessionFactory);
}());