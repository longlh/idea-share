;(function() {
	'use strict';

	var Dashboard = function(session) {

		console.log(session);

	};

	Dashboard.$inject = [ 'session' ];

	angular.module('app.dashboard').controller('app.dashboard.controllers.Dashboard', Dashboard);
}());