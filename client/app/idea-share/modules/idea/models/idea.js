;(function() {
	'use strict';

	var IdeaFactory = function(ModelFactory) {

		var Idea = ModelFactory.model({
			resource: {
				path: '/api/ideas/:id',
				defaultParameters: {
					id: '@id'
				}
			},
			instantiation: {
				defaultProperties: {
					fragments: []
				}
			}
		});

		return Idea;
	};

	IdeaFactory.$inject = [
		'app.share.services.ModelFactory'
	];

	angular.module('app.idea').factory('app.idea.models.Idea', IdeaFactory);
}());
