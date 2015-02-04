;(function() {
	'use strict';

	var Dashboard = function($scope) {
		alert('x');
	};

	Dashboard.$inject = [ '$scope' ];

	angular.module('idea').controller('Dashboard', Dashboard);
}());