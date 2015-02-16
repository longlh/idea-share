;(function () {
	'use strict';

	function setRequireProperties(idea) {
		if (!_.isArray(idea.fragments)) {
			idea.fragments = [];
		}
	}

	var IdeaFactory = function($resource) {
		var Resource = $resource('/api/ideas/:id', {
			id: '@id'
		}, {
			create: {
				method: 'post'
			},
			get: {
				method: 'get'
			}
		});

		var Idea = function(properties) {
			var resource = new Resource(properties);
			// Resource.apply(this, arguments);



			setRequireProperties(resource);

			return Object.create(resource);
			// this.resource = resource;




			// return Object.create(resource, {
			// 	constructor: {
			// 		configuration: true,
			// 		enumerable: true,
			// 		value: Idea,
			// 		writable: true
			// 	}
			// });
		};

		// Idea.prototype = Resource;

		return Idea;
	};

	IdeaFactory.$inject = [ '$resource' ];

	angular.module('app.idea').factory('app.idea.models.Idea', IdeaFactory);
}());