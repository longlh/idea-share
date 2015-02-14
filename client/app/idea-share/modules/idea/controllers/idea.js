;(function() {
	'use strict';

	var Idea = function($scope, Idea, idea) {
		$scope.idea = idea;

		var otherIdea = new Idea({
			id: 'xxx',
			brief: 'hahaha'
		});

		console.log(otherIdea);

		console.log($scope.idea);
	};

	Idea.$inject = [ '$scope', 'app.idea.models.Idea', 'idea' ];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);

})();