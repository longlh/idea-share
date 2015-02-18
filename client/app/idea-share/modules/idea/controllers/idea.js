;(function() {
	'use strict';

	var Idea = function(resolvedIdea, $scope, Idea) {
		$scope.idea = resolvedIdea;

		var otherIdea = new Idea({
			brief: 'hahaha'
		});

		console.info(otherIdea instanceof Idea);

		otherIdea.$save().then(function(idea) {
			console.log(idea, idea instanceof Idea);
		});

		Idea.query().then(function(ideas) {
			console.log(ideas);
		});
	};

	Idea.$inject = [
		'idea',
		'$scope',
		'app.idea.models.Idea'
	];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);
})();
