;(function() {
	'use strict';

	var IdeaFactory = function(ModelFactory, Fragment) {
		var Idea = ModelFactory.model({
			resource: {
				path: '/api/ideas/:id',
				defaultParameters: {
					id: '@_id'
				}
			},
			instantiation: {
				defaultProperties: {
					fragments: [],
					comments: []
				},
				construct: function() {
					var self = this;

					_.forEach(self.fragments, function(fragment, index) {
						self.fragments[index] = new Fragment(fragment).belongsTo(self);
					});
				}
			},
			ignoreProperties: ['comments', 'owner']
		});

		return Idea;
	};

	IdeaFactory.$inject = [
		'app.share.services.ModelFactory',
		'app.idea.models.Fragment',
	];

	angular.module('app.idea').factory('app.idea.models.Idea', IdeaFactory);
}());
