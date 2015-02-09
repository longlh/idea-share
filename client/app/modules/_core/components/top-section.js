;(function() {
	'use strict';

	var TopSection = function(Session) {
		return {
			restrict: 'E',
			templateUrl: '/modules/_core/components/top-section.html'
		};
	};

	TopSection.$inject = [ 'app.auth.models.Session' ];

	angular.module('app.core').directive('topSection', TopSection);
}());