;(function() {
	'use strict';

	var DEFAULT_METHODS = {
			query: {
				method: 'get',
				isArray: true
			},
			get: {
				method: 'get'
			},
			save: {
				method: 'post'
			},
			delete: {
				method: 'delete'
			}
		};

	var ModelFactory = function($resource) {

		return {
			model: function(options) {
				_.defaults(options.resource, {
					methods: {}
				});

				_.defaults(options.resource.methods, DEFAULT_METHODS);

				var Resource = $resource(options.resource.path, options.resource.defaultParameters, options.resource.methods);

				var Model = function(properties) {

					_.assign(this, properties);

					if (options.instantiation) {
						_.defaults(this, _.clone(options.instantiation.defaultProperties, true));

						if (_.isFunction(options.instantiation.construct)) {
							options.instantiation.construct.apply(this);
						}
					}
				};

				Model.prototype = Object.create(new Resource(), {
					constructor: {
						value: Model
					}
				});

				_.forEach(options.resource.methods, function iterate(meta, method) {
					if (meta && _.isFunction(Resource[method])) {
						Model[method] = function() {

							return Resource[method].apply(Model, arguments).$promise;
						};
					}
				});

				return Model;
			}
		};
	};

	ModelFactory.$inject = ['$resource'];

	angular.module('app.share').factory('app.share.services.ModelFactory', ModelFactory);
}());
