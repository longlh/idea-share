;(function() {
	'use strict';
	var validateSession = function($q, Session) {
		return Session.current ? Session.current.$validate() : $q.reject();
	};

	validateSession.$inject = [ '$q', 'app.share.models.Session' ];

	var destroySession = function($q, Session) {
		return Session.current ? Session.current.$destroy() : $q.when();
	};

	destroySession.$inject = [ '$q', 'app.share.models.Session' ];

	var config = function($routeProvider) {

		$routeProvider.when('/', {
			redirectTo: '/dashboard'
		}).when('/dashboard', {
			controller: 'app.dashboard.controllers.Dashboard',
			templateUrl: '/modules/dashboard/views/dashboard.html',
			resolve: {
				session: validateSession
			}
		}).when('/sign-in', {
			controller: 'app.auth.controllers.SignIn',
			resolve: {
				destroySession: destroySession
			},
			templateUrl: '/modules/auth/views/sign-in.html'
		}).when('/ideas/:id', {
			controller: 'app.idea.controllers.Idea',
			templateUrl: '/modules/idea/views/idea.html',
			resolve: {
				session: validateSession,
				idea: [ 'app.idea.resolvers.Idea', function resolver(ideaResolver) {
					return ideaResolver();
				} ]
			}
		}).when('/404', {
			templateUrl: '/modules/share/views/404.html'
		}).otherwise({
			redirectTo: '/404'
		});
	};

	config.$inject = [ '$routeProvider' ];

	var run = function($rootScope, $location) {

		$rootScope.$on('$routeChangeError', function(e) {
			$location.url('/sign-in');
		});

	};

	run.$inject = [ '$rootScope', '$location' ];

	// bootstrap application
	angular
			.module('app', [
				'app.share', 'app.auth', 'app.dashboard', 'app.idea',
				'ngRoute' ])
			.config(config)
			.run(run);
}());