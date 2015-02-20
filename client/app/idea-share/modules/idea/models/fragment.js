;(function(ns) {
	'use strict';

	var FragmentFactory = function(ModelFactory) {
		var Fragment = ModelFactory.model({
			resource: {
				path: '/api/ideas/:ideaId/fragments/:id',
				defaultParameters: {
					id: '@_id',
					ideaId: '@_idea._id'
				}
			},
			ignoreProperties: ['_idea']
		});

		return Fragment;
	};

	FragmentFactory.$inject = [
		'app.share.services.ModelFactory'
	];

	angular.module(ns).factory(ns + '.models.Fragment', FragmentFactory);
}('app.idea'));
