;(function() {
	'use strict';

	var textBox = function() {
		return {
			restrict: 'E',
			templateUrl: '/modules/_share/components/text-box.html',
			scope: {
				showControls: '=',
				model: '=',
				key: '@',
				onSave: '&'
			},
			link: function($scope, element, attrs) {
				var textbox = element.find('input');
				var backup;

				$scope.state = 0;

				$scope.enableEdit = function() {
					if ($scope.model && $scope.key) {
						$scope.state = 1;

						backup = $scope.model[$scope.key];

						setTimeout(function() {
							textbox[0].focus();
						});
					}
				};

				$scope.discard = function() {
					if ($scope.model && $scope.key) {
						$scope.state = 0;

						$scope.model[$scope.key] = backup;
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

	textBox.$inject = [];

	angular.module('app.share').directive('shTextBox', textBox);
}());
