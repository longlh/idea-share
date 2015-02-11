;(function () {
	'use strict';

	var Idea = function($resource) {
		var Session = $resource('/api/ideas/:id', {
			id: '@id'
		}, {
			create: {
				method: 'post'
			},
			get: {
				method: 'get'
			}
		});

		return Session;
	};

	Idea.$inject = [ '$resource' ];

	angular.module('app.idea').factory('app.idea.models.Idea', Idea);
}());