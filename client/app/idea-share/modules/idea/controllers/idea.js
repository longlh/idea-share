;(function() {
	'use strict';

	var Idea = function($scope, Idea, resolvedIdea) {
		$scope.idea = resolvedIdea;

		var otherIdea = new Idea({
			id: 'xxx',
			brief: 'hahaha'
		});

		console.log(otherIdea);
		console.log(otherIdea instanceof Idea);
		console.log(typeof otherIdea);

		console.log($scope.idea);

		otherIdea.$save();
	};

	Idea.$inject = [ '$scope', 'app.idea.models.Idea', 'idea' ];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);

})();