;(function() {
	'use strict';

	var TopSection = function(Session) {
		return {
			restrict: 'E',
			templateUrl: '/modules/share/components/top-section.html'
		};
	};

	TopSection.$inject = [ 'app.share.models.Session' ];

	angular.module('app.share').directive('topSection', TopSection);
}());