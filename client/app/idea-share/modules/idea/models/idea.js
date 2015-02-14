;(function () {
	'use strict';

	var Idea = function($resource) {
		var proto = $resource('/api/ideas/:id', {
			id: '@id'
		}, {
			create: {
				method: 'post'
			},
			get: {
				method: 'get'
			}
		});

		var IdeaConstructor = function() {
			this.brief = 'New Idea';

			console.log(arguments);

			proto.apply(this, arguments);
		};
		IdeaConstructor.prototype = proto;

		Object.setPrototypeOf(IdeaConstructor, proto);

		// var IdeaClass = Object.create(proto, {
		// 	constructor: IdeaConstructor
		// });

		// Idea.prototype = proto;

		return IdeaConstructor;
	};

	Idea.$inject = [ '$resource' ];

	angular.module('app.idea').factory('app.idea.models.Idea', Idea);
}());