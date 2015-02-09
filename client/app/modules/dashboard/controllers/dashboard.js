;(function() {
	'use strict';

	var Dashboard = function() {

		console.log('enter dashboard');

	};

	Dashboard.$inject = [];

	angular.module('app.dashboard').controller('app.dashboard.controllers.Dashboard', Dashboard);
}());