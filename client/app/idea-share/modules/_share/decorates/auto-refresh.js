(function() {
	'use strict';

	var autoRefresh = function() {
		return {
			restrict : 'A',
			controller: ['$scope', function($scope) {
				var id = setInterval(function() {
					$scope.$apply();
				}, 30e3);

				$scope.$on('$destroy', function() {
					clearInterval(id);
				});
			}]
		};
	};

	autoRefresh.$inject = [];

	angular.module('app.share').directive('shAutoRefresh', autoRefresh);
}());
