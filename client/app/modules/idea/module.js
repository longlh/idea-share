;(function() {
	'use strict';

	var sessionResolver = function(resolver) {
		return resolver();
	};

	sessionResolver.$inject = [ 'app.auth.resolvers.Session' ];

	var config = function($routeProvider) {

		$routeProvider.when('/ideas/:id', {
			controller: 'app.idea.controllers.Idea',
			templateUrl: '/modules/idea/views/idea.html',
			resolve: {
				session: sessionResolver,
				idea: [ 'app.idea.resolvers.Idea', function resolver(ideaResolver) {
					return ideaResolver();
				} ]
			}
		});
	};

	config.$inject = [ '$routeProvider' ];

	angular.module('app.idea', [
		'app.template', 'app.auth',
		'ngResource', 'ngRoute'
	]).config(config);
}());