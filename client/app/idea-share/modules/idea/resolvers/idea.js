;(function() {
	'use strict';


	var IdeaResolver = function($route, Idea) {
		return function() {
			var id = $route.current.params.id;

			if (id === 'new') {
				var idea = new Idea();

				return idea;
			} else {
				return Idea.get({
					id: id
				}).$promise;
			}
		};
	};

	IdeaResolver.$inject = [ '$route', 'app.idea.models.Idea' ];

	angular.module('app.idea').factory('app.idea.resolvers.Idea', IdeaResolver);
}());