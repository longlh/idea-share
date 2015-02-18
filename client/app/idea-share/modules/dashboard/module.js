;(function() {
	'use strict';

	var sessionResolver = function(resolver) {
		return resolver();
	};

	sessionResolver.$inject = [
		'app.auth.resolvers.Session'
	];

	var config = function($routeProvider) {
		$routeProvider.when('/dashboard', {
			controller: 'app.dashboard.controllers.Dashboard',
			templateUrl: '/modules/dashboard/views/dashboard.html',
			resolve: {
				session: sessionResolver
			}
		});
	};

	config.$inject = [
		'$routeProvider'
	];

	angular.module('app.dashboard', [
		'ngRoute',
		'app.template', 'app.auth'
	]).config(config);
}());
