;(function() {
	'use strict';


	var IdeaResolver = function($route) {
		return function() {
			console.log($route.current.params);
		};
	};

	IdeaResolver.$inject = [ '$route' ];

	angular.module('app.idea').factory('app.idea.resolvers.Idea', IdeaResolver);
}());