;(function() {
	'use strict';

	var FragmentFactory = function(ModelFactory) {
		var Fragment = ModelFactory.model({
			resource: {
				path: '/api/ideas/:ideaId/fragments/:id',
				defaultParameters: {
					id: '@_id',
					ideaId: '@_idea'
				}
			},
			instantiation: {
				_ignore: ['_idea', '_edit']
			}
		});

		Object.defineProperty(Fragment.class.prototype, 'belongsTo', {
			value: function(idea) {
				this._idea = idea._id;
				return this;
			}
		});

		Object.defineProperty(Fragment.class.prototype, 'save', {
			value: function() {
				var self = this;
				var idea = self._idea;

				return Fragment.base.save.apply(self).then(function saveDone(fragment) {
					return fragment.belongsTo(idea);
				});
			}
		});

		Object.defineProperty(Fragment.class.prototype, 'get', {
			value: function() {
				var self = this;
				var idea = self._idea;

				return Fragment.base.get.apply(self).then(function getDone(fragment) {
					return fragment.belongsTo(idea);
				});
			}
		});

		Object.defineProperty(Fragment.class.prototype, 'editable', {
			value: function() {
				if (arguments.length) {
					// setter
					this._edit = arguments[0];
					return this;
				} else {
					return this._edit;
				}
			}
		});

		return Fragment.class;
	};

	FragmentFactory.$inject = [
		'app.share.services.ModelFactory'
	];

	angular.module('app.idea').factory('app.idea.models.Fragment', FragmentFactory);
}());
