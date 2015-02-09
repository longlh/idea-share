;(function() {
	'use strict';

	var SessionResolver = function($q, Session) {
		return function() {
			return Session.current ? Session.current.$validate() : $q.reject();
		};
	};

	SessionResolver.$inject = [ '$q', 'app.auth.models.Session'  ];

	angular.module('app.auth').factory('app.auth.resolvers.Session', SessionResolver);
}());