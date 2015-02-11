;(function() {
	'use strict';

	var SessionResolver = function($cookieStore, $q, Session, Storage) {
		return function() {
			return Storage.session ? Storage.session.$validate() : $q.reject(401);
		};
	};

	SessionResolver.$inject = [ '$cookieStore', '$q', 'app.auth.models.Session', 'app.share.models.Storage' ];

	angular.module('app.auth').factory('app.auth.resolvers.Session', SessionResolver);
}());