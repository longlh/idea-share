;(function() {
	'use strict';

	var CommentFactory = function(ModelFactory) {
		var Comment = ModelFactory.model({
			resource: {
				path: '/api/ideas/:idea/comments/:id',
				defaultParameters: {
					id: '@_id',
					idea: '@idea'
				}
			},
			instantiation: {

			}
		});

		return Comment.class;
	};

	CommentFactory.$inject = [
		'app.share.services.ModelFactory'
	];

	angular.module('app.idea').factory('app.idea.models.Comment', CommentFactory);
}());
