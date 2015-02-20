;(function() {
	'use strict';

	var Idea = function(resolvedIdea, $location, $scope, Fragment, Idea) {
		$scope.isCreate = !resolvedIdea._id;
		$scope.idea = resolvedIdea;

		console.log($scope.idea);

		$scope.saveIdea = function() {
			// console.log(resolvedIdea instanceof Idea);
			$scope.idea.save().then(function() {
				if ($scope.isCreate) {
					$location.url('/ideas/' + $scope.idea._id);
				}
			});
		};

		$scope.addFragment = function() {
			$scope.idea.fragments.push(new Fragment({
				_idea: $scope.idea
			}));
		};

		$scope.saveFragment = function(fragment) {
			// var index = $scope.idea
			// fragment.save();
			console.log(fragment instanceof Fragment);
		};
	};

	Idea.$inject = [
		'idea',
		'$location', '$scope',
		'app.idea.models.Fragment', 'app.idea.models.Idea'
	];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);
})();
