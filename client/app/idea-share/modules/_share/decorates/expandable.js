;(function() {
	'use strict';

	var expandable = function($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function($scope, element, attrs, ngModel) {
				var textArea = element[0];
				var computedStyle = getComputedStyle(textArea);
				var borderTopWidth = parseInt(computedStyle.borderTopWidth, 10);
				var borderBottomWidth = parseInt(computedStyle.borderBottomWidth, 10);

				var resize = function() {
					textArea.style.height = 0;
					textArea.style.height = (textArea.scrollHeight + borderTopWidth + borderBottomWidth) + 'px';
				};

				element.addClass('text-area-expandable');
				element.on('input', resize);

				$scope.$watch(function() {
					return ngModel.$modelValue;
				}, resize);
			}
		};
	};

	expandable.$inject = ['$timeout'];

	angular.module('app.share').directive('shExpandable', expandable);
}());
