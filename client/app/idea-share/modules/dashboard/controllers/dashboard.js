;(function() {
	'use strict';

	var Dashboard = function($scope, Idea) {
		Idea.query().then(function queryDone(ideas) {
			$scope.ideas = ideas;
		});
	};

	Dashboard.$inject = [
		'$scope',
		'app.idea.models.Idea'
	];

	angular.module('app.dashboard').controller('app.dashboard.controllers.Dashboard', Dashboard);
}());
