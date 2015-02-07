;(function() {
	'use strict';
	var validateSession = function($q, Session) {
		return Session.current ? Session.current.$validate() : $q.reject();
	};

	validateSession.$inject = [ '$q', 'share.models.Session' ];

	var destroySession = function($q, Session) {
		return Session.current ? Session.current.$destroy() : $q.resolve();
	};

	destroySession.$inject = [ '$q', 'share.models.Session' ];

	var config = function($routeProvider) {
		$routeProvider.when('/dashboard', {
			controller: 'Dashboard',
			templateUrl: '/modules/dashboard/views/dashboard.html',
			resolve: {
				session: validateSession
			}
		}).when('/sign-in', {
			controller: 'auth.SignIn',
			resolve: {
				destroySession: destroySession
			},
			templateUrl: '/modules/auth/views/sign-in.html'
		}).otherwise({
			redirectTo: '/dashboard'
		});
	};

	config.$inject = [ '$routeProvider' ];

	var run = function($rootScope, $location, Session) {
		Object.defineProperty($rootScope, 'session', {
			get: function() {
				return Session.current;
			}
		});

		$rootScope.$on('$routeChangeError', function(e) {
			$location.url('/sign-in');
		});
	};

	run.$inject = [ '$rootScope', '$location', 'share.models.Session' ];

	// bootstrap application
	angular
			.module('idea', [ 'ngCookies', 'ngResource', 'ngRoute' ])
			.config(config)
			.run(run);
}());