;(function() {
	'use strict';

	var textArea = function() {
		return {
			restrict: 'E',
			templateUrl: '/modules/_share/components/text-area.html',
			scope: {
				showControls: '=',
				model: '=',
				key: '@',
				onSave: '&'
			},
			link: function($scope, element, attrs) {
				var textArea = element.find('textarea');
				var backup;

				$scope.state = 0;

				$scope.enableEdit = function() {
					if ($scope.model && $scope.key) {
						$scope.state = 1;

						backup = $scope.model[$scope.key];

						setTimeout(function() {
							textArea[0].focus();
						});
					}
				};

				$scope.discard = function() {
					if ($scope.model && $scope.key) {
						$scope.state = 0;

						$scope.model[$scope.key] = backup;

						setTimeout(function() {
							textArea.triggerHandler('input');
						});
					}
				};

				$scope.save = function() {
					// indicate processing
					$scope.state = 2;

					$scope.onSave().finally(function() {
						$scope.state = 0;
					});
				};
			}
		};
	};

	textArea.$inject = [];

	angular.module('app.share').directive('shTextArea', textArea);
}());
