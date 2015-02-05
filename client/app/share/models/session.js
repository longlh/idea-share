;(function () {
	'use strict';
	var fingerprint = new window.Fingerprint({
		canvas: true
	}).get();

	var SessionFactory = function($cookies, $resource) {
		// internal storage
		var _session = null;

		var interceptor = {
			response: function(response) {
				// store current session
				_session = response.resource;

				// store token in cookies
				$cookies.token = _session.token;

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
						$cookies.token = null;

						return response;
					}
				}
			},
			validate: {
				method: 'get',
				interceptor: interceptor
			}
		});

		Object.defineProperty(Session.prototype, 'password', {
			set: function(value) {
				// create hashedPassword
				this.hashedPassword = value;
			}
		});

		Object.defineProperty(Session, 'current', {
			get: function() {
				if (_session) {
					return _session;
				} else if ($cookies.token) {
					// get session from cookie
					return new Session({
						token: $cookies.token
					});
				}
			}
		});

		return Session;
	};

	SessionFactory.$inject = [ '$cookies', '$resource' ];

	angular.module('idea').factory('share.models.Session', SessionFactory);
}());