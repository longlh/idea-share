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
		} else {
			$scope.new = true;
			$scope.idea.editable = true;
			$scope.idea.includeProperty('fragments');
		}

		$scope.saveIdea = function() {
			$scope.idea.save().then(function saveDone(idea) {
				if ($scope.new) {
					$location.url('/ideas/' + idea._id);
				}
			});
		};

		$scope.addFragment = function() {
			$scope.idea.fragments.push(new Fragment().belongsTo($scope.idea).editable
				(true));
		};

		$scope.saveFragment = function(fragment) {
			$scope.idea.saveFragment(fragment.editable(false));
		};

		$scope.discardFragmentChanges = function(fragment) {
			$scope.idea.reloadFragment(fragment.editable(false));
		};

		$scope.deleteFragment = function(fragment) {
			$scope.idea.removeFragment(fragment);
		};

		$scope.editFragment = function(fragment) {
			fragment.editable(true);
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
