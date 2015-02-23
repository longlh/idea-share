;(function() {
	'use strict';

	var errorInterceptor = function($location, $q) {

		return {
			responseError: function(rejection) {

				// if (rejection.status === 404) {
				// 	$location.url('/404');
				// }

				return $q.reject(rejection);
			}
		};
	};

	errorInterceptor.$inject = ['$location', '$q'];

	var config = function($httpProvider, $routeProvider) {

		$routeProvider.when('/', {
			redirectTo: '/dashboard'
		}).when('/404', {
			templateUrl: '/modules/_core/views/404.html'
		}).otherwise({
			redirectTo: '/404'
		});

		$httpProvider.interceptors.push(errorInterceptor);
	};

	config.$inject = ['$httpProvider', '$routeProvider'];

	angular.module('app.core', [
		'ngCookies', 'ngResource',
		'app.template', 'app.auth'
	]).config(config);

}());
