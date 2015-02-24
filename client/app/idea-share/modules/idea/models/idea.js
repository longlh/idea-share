;(function() {
	'use strict';

	var IdeaFactory = function($q, ModelFactory, Fragment) {
		var Idea = ModelFactory.model({
			resource: {
				path: '/api/ideas/:id',
				defaultParameters: {
					id: '@_id'
				}
			},
			instantiation: {
				defaultProperties: {
					_ignore: ['fragments', 'owner'],
					fragments: []
				},
				construct: function() {
					var self = this;

					_.forEach(self.fragments, function(fragment, index) {
						self.fragments[index] = new Fragment(fragment).belongsTo(self);
					});
				}
			}
		});

		Object.defineProperty(Idea.class.prototype, 'saveFragment', {
			value: function(fragment) {
				var self = this;
				var index = self.fragments.indexOf(fragment);

				if (index > -1) {
					return fragment.save().then(function saveDone(frag) {
						self.fragments[index] = frag.belongsTo(self);

						return frag;
					});
				}
			}
		});

		Object.defineProperty(Idea.class.prototype, 'removeFragment', {
			value: function(fragment) {
				var self = this;
				var index = self.fragments.indexOf(fragment);

				if (index > -1) {
					if (fragment._id) {
						return fragment.delete();
					} else {
						_.pullAt(self.fragments, index);
						return $q.when();
					}
				}
			}
		});

		Object.defineProperty(Idea.class.prototype, 'reloadFragment', {
			value: function(fragment) {
				var self = this;
				var index = self.fragments.indexOf(fragment);

				if (index > -1 && fragment._id) {
					return fragment.get().then(function reloadDone(frag) {
						self.fragments[index] = frag.belongsTo(self);
					});
				}
			}
		});

		return Idea.class;
	};

	IdeaFactory.$inject = [
		'$q',
		'app.share.services.ModelFactory', 'app.idea.models.Fragment'
	];

	angular.module('app.idea').factory('app.idea.models.Idea', IdeaFactory);
}());
