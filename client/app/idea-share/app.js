;(function() {
	'use strict';

	// bootstrap application
	angular.module('app', [
		'ngAnimate',
		'app.core', 'app.auth', 'app.dashboard', 'app.idea'
	]);

	angular.element(document).ready(function() {
		if (location.hash === '#_=_') {
			location.hash = '';
		}

		angular.bootstrap(document, ['app']);
	});
}());
