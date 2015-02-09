;(function() {
	'use strict';

	var purgeSession = function(Session) {
		return Session.current ? Session.current.$destroy() : null;
	};

	purgeSession.$inject = [ 'app.auth.models.Session' ];

	var config = function($routeProvider) {
		$routeProvider.when('/sign-in', {
			controller: 'app.auth.controllers.SignIn',
			resolve: {
				purgeSession: purgeSession
			},
			templateUrl: '/modules/auth/views/sign-in.html'
		});
	};

	config.$inject = [ '$routeProvider' ];

	var run = function($rootScope, $location) {

		$rootScope.$on('$routeChangeError', function(e) {
			$location.url('/sign-in');
		});

	};

	run.$inject = [ '$rootScope', '$location' ];

	angular.module('app.auth', [
		'app.template',
		'ngCookies', 'ngResource', 'ngRoute'
	]).config(config).run(run);
}());