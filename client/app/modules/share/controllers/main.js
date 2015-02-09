;(function () {
	'use strict';

	console.log('x');

	var Main = function(Session) {
		// Object.defineProperty(this, 'session', {
		// 	get: function() {
		// 		return Session.current;
		// 	}
		// });

		this.isAuthenticated = function() {
			return !!Session.current;
		};
	};

	Main.$inject = [ 'app.share.models.Session' ];

	angular.module('app.share').controller('app.share.controllers.Main', Main);
}());