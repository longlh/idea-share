;(function() {
	'use strict';

	var Main = function(Storage) {

		this.isAuthenticated = function() {
			return !!Storage.session;
		};
	};

	Main.$inject = ['app.share.models.Storage'];

	angular.module('app.core').controller('app.core.controllers.Main', Main);
}());
