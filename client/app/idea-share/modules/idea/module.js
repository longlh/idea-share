;(function() {
	'use strict';

	var sessionResolver = function(resolver) {
		return resolver();
	};

	sessionResolver.$inject = [
		'app.auth.resolvers.Session'
	];

	var ideaResolver = function(resolver) {
		return resolver();
	};

	ideaResolver.$inject = [
		'app.idea.resolvers.Idea'
	];

	var config = function($routeProvider) {

		$routeProvider.when('/ideas/:id', {
			controller: 'app.idea.controllers.Idea',
			templateUrl: '/modules/idea/views/idea.html',
			resolve: {
				session: sessionResolver,
				idea: ideaResolver
			}
		});
	};

	config.$inject = [
		'$routeProvider'
	];

	angular.module('app.idea', [
		'ngResource', 'ngRoute',
		'app.template', 'app.share', 'app.auth',
	]).config(config);
}());
