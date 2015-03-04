;(function() {
	'use strict';

	var Idea = function(resolvedIdea, $location, $scope, Comment, Fragment, Idea) {
		$scope.idea = resolvedIdea;

		if ($scope.idea._id) {
			$scope.new = false;

			// init new comment
			$scope.newComment = new Comment({
				idea: $scope.idea._id
			});

			// load comments
			Comment.query({
				idea: $scope.idea._id
			}).then(function queryDone(comments) {
				$scope.comments = comments;
			});

			// create brief binding
			$scope.bindings = {
				brief: {
					value: $scope.idea,
					key: 'brief',
					editable: $scope.new
				}
			};
		} else {
			$scope.new = true;
			$scope.idea.editable = true;
			$scope.idea.includeProperty('fragments');
		}

		$scope.saveIdea = function() {
			return $scope.idea.save().then(function saveDone(idea) {
				if ($scope.new) {
					$location.url('/ideas/' + idea._id);
				}
			});
		};

		$scope.addFragment = function() {
			if ($scope.idea.editable) {
				$scope.idea.fragments.push(new Fragment().belongsTo($scope.idea));
			}
		};

		$scope.saveFragment = function(deferred, fragment) {
			return $scope.idea.saveFragment(fragment);
		};

		$scope.deleteFragment = function(fragment) {
			$scope.idea.removeFragment(fragment);
		};

		$scope.postComment = function() {
			$scope.newComment.save().then(function(comment) {

				$scope.comments.splice(0, 0, comment);

				$scope.newComment = new Comment({
					idea: $scope.idea._id
				});
			});
		};
	};

	Idea.$inject = [
		'idea',
		'$location', '$scope',
		'app.idea.models.Comment', 'app.idea.models.Fragment', 'app.idea.models.Idea'
	];

	angular.module('app.idea').controller('app.idea.controllers.Idea', Idea);
}());
