;(function () {
	'use strict';
	var COOKIE_KEY_TOKEN = 'token';

	var fingerprint = new window.Fingerprint({
		canvas: true
	}).get();

	var SessionFactory = function($cookieStore, $resource) {
		// internal storage
		var _session = null;

		var interceptor = {
			response: function(response) {
				// store current session
				_session = response.resource;

				// store token in cookies
				$cookieStore.put(COOKIE_KEY_TOKEN, _session.token);

				return _session;
			}
		};

		var Session = $resource('/api/sessions/:token', {
			fp: fingerprint,
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
						_session = null;

						// clear cookie
						$cookieStore.remove(COOKIE_KEY_TOKEN);

						return response;
					}
				}
			},
			validate: {
				method: 'get',
				interceptor: interceptor
			}
		});

		Object.defineProperty(Session, 'current', {
			get: function() {
				if (_session) {
					return _session;
				} else if ($cookieStore.get(COOKIE_KEY_TOKEN)) {
					// get session from cookie
					return new Session({
						token: $cookieStore.get(COOKIE_KEY_TOKEN)
					});
				}
			}
		});

		return Session;
	};

	SessionFactory.$inject = [ '$cookieStore', '$resource' ];

	angular.module('app.auth').factory('app.auth.models.Session', SessionFactory);
}());