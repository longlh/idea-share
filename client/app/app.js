;(function() {
	'use strict';

	// bootstrap application
	angular.module('app', [
		'app.core', 'app.auth', 'app.dashboard', 'app.idea'
	]);
}());