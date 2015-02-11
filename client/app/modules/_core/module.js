;(function() {
	'use strict';

	var notFoundHandler = function($location, $q) {

		return {
			responseError: function(rejection) {
				if (rejection.status === 404) {
					$location.url('/404');
				}

				return $q.reject(rejection);
			}
		};
	};

	notFoundHandler.$inject = [ '$location', '$q' ];

	var config = function($httpProvider, $routeProvider) {

		$routeProvider.when('/', {
			redirectTo: '/dashboard'
		}).when('/404', {
			templateUrl: '/modules/_core/views/404.html'
		}).otherwise({
			redirectTo: '/404'
		});

		$httpProvider.interceptors.push(notFoundHandler);
	};

	config.$inject = [ '$httpProvider', '$routeProvider' ];

	angular.module('app.core', [
		'app.template', 'app.auth',
		'ngCookies', 'ngResource'
	]).config(config);

}());