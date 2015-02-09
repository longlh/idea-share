;(function () {
	'use strict';

	angular.module('app.share').factory('app.share.models.User', [ '$resource', function init($resource) {
		var User = $resource('/api/users/:id', {
			id: '@id'
		}, {
			current: {
				method: 'get',
				params: {
					id: 'me'
				}
			},
		});

		return User;
	} ]);
}());