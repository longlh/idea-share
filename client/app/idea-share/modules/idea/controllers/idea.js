;(function() {
	'use strict';

	var Idea = function(resolvedIdea, $location, $scope, Fragment, Idea) {
		$scope.idea = resolvedIdea;

		if (resolvedIdea._id) {
			$scope.new = false;
		} else {
			$scope.new = true;
			$scope.idea.includeProperty('fragments');
		}

		$scope.saveIdea = function() {
			$scope.idea.save().then(function(idea) {
				if ($scope.isCreate) {
					$location.url('/ideas/' + $scope.idea._id);
				}
			});
		};

		$scope.addFragment = function() {
			$scope.idea.fragments.push(new Fragment().belongsTo($scope.idea));
		};

		$scope.saveFragment = function(fragment, index) {
			return fragment.save();
		};
	};

	Idea.$inject = [
		'idea',
		'$location', '$scope',
		'app.idea.models.Fragment', 'app.idea.models.Idea'
	];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);
})();
