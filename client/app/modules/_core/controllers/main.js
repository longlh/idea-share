;(function () {
	'use strict';

	var Main = function(Session) {

		this.isAuthenticated = function() {
			return !!Session.current;
		};
	};

	Main.$inject = [ 'app.auth.models.Session' ];

	angular.module('app.core').controller('app.core.controllers.Main', Main);
}());