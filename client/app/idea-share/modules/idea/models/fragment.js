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

		var base = Object.getPrototypeOf(Fragment.prototype);

		Object.defineProperty(Fragment.prototype, 'belongsTo', {
			value: function(idea) {
				this._idea = idea;
				return this;
			}
		});

		Object.defineProperty(Fragment.prototype, 'save', {
			value: function() {
				var self = this;
				var idea = self._idea;

				return base.save.apply(this).then(function() {
					return self.belongsTo(idea);
				});
			}
		});

		return Fragment;
	};

	FragmentFactory.$inject = [
		'app.share.services.ModelFactory'
	];

	angular.module(ns).factory(ns + '.models.Fragment', FragmentFactory);
}('app.idea'));
