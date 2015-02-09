;(function() {
	'use strict';

	var config = function($routeProvider) {

		$routeProvider.when('/', {
			redirectTo: '/dashboard'
		}).when('/404', {
			templateUrl: '/modules/_core/views/404.html'
		}).otherwise({
			redirectTo: '/404'
		});
	};

	config.$inject = [ '$routeProvider' ];

	// bootstrap application
	angular.module('app', [
		'app.core', 'app.auth', 'app.dashboard', 'app.idea',
		'ngRoute'
	]).config(config);
}());