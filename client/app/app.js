;(function() {
	'use strict';
	var validateSession = function validate($q, Session) {
		return Session.current ? Session.current.$validate() : $q.reject();
	};

	validateSession.$inject = [ '$q', 'share.models.Session' ];

	angular
			.module('idea', [ 'ngCookies', 'ngResource', 'ngRoute' ])
			.config([ '$routeProvider', function configurate($routeProvider) {

				$routeProvider.when('/', {
					redirectTo: '/dashboard'
				}).when('/dashboard', {
					controller: 'Dashboard',
					templateUrl: '/modules/dashboard/views/dashboard.html',
					resolve: {
						session: validateSession
					}
				}).when('/sign-in', {
					controller: 'auth.SignIn',
					templateUrl: '/modules/auth/views/sign-in.html'
				});

			} ])
			.run([ '$rootScope', '$location', function init($rootScope, $location) {

				$rootScope.$on('$routeChangeError', function(e) {
					$location.url('/sign-in');
				});

			} ]);
}());