;(function() {
	'use strict';

	var purgeSession = function(Storage) {

		return Storage.session ? Storage.session.$delete() : null;
	};

	purgeSession.$inject = [
		'app.share.models.Storage'
	];

	var authIntercepter = function($location, $q, Storage) {
		return {
			request: function(config) {

				// add session.token to every request's headers if possible
				if (Storage.session) {
					config.headers.Authorization = Storage.session.token;
				}

				return config;
			},
			responseError: function(rejection) {

				if (rejection.status === 401) {
					$location.url('/sign-in');
				}

				return $q.reject(rejection);
			}
		};
	};

	authIntercepter.$inject = [
		'$location', '$q',
		'app.share.models.Storage'
	];

	var config = function($httpProvider, $routeProvider) {

		$routeProvider.when('/sign-in', {
			controller: 'app.auth.controllers.SignIn',
			resolve: {
				purgeSession: purgeSession
			},
			templateUrl: '/modules/auth/views/sign-in.html'
		});

		$httpProvider.interceptors.push(authIntercepter);
	};

	config.$inject = [
		'$httpProvider',
		'$routeProvider'
	];

	var run = function($cookieStore, $location, $rootScope, Session, Storage) {

		$rootScope.$on('$routeChangeError', function(event, next, previous, error) {

			if (error === 401) {
				$location.url('/sign-in');
				event.preventDefault();
			}
		});

		// restore a not-validate-yet session from cookie
		if (!Storage.session && $cookieStore.get(Session.KEY)) {

			Storage.session = new Session({
				token: $cookieStore.get(Session.KEY)
			});
		}
	};

	run.$inject = [
		'$cookieStore', '$location', '$rootScope',
		'app.auth.models.Session', 'app.share.models.Storage'
	];

	angular.module('app.auth', [
		'ngCookies', 'ngResource', 'ngRoute',
		'app.template', 'app.share'
	]).config(config).run(run);
}());
