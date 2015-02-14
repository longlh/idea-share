;(function() {
	'use strict';

	var TopSection = function() {
		return {
			restrict: 'E',
			templateUrl: '/modules/_core/components/top-section.html'
		};
	};

	TopSection.$inject = [];

	angular.module('app.core').directive('topSection', TopSection);
}());