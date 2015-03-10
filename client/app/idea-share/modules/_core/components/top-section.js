;(function() {
	'use strict';

	var TopSection = function(Storage) {
		return {
			restrict: 'E',
			templateUrl: '/modules/_core/components/top-section.html',
			controller: ['$scope', function($scope) {
				$scope.storage = Storage;
			}]
		};
	};

	TopSection.$inject = [
		'app.share.models.Storage'
	];

	angular.module('app.core').directive('coTopSection', TopSection);
}());
