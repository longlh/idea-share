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

				var Model = function(properties) {
					_.assign(this, properties);

					if (options.instantiation) {
						_.defaults(this, _.clone(options.instantiation.defaultProperties, true));

						if (_.isFunction(options.instantiation.construct)) {
							options.instantiation.construct.apply(this);
						}
					}
				};

				var transform = function(customHandler) {
					return function(response) {
						if (response.resource) {
							var data;

							if (_.isArray(response.resource)) {
								data = _.map(response.resource, function iterate(r) {
									return new Model(r);
								});
							} else {
								data = new Model(response.resource);
							}

							return _.isFunction(customHandler) ?
									customHandler(response, data) : data;
						}
					};
				};

				_.defaults(options.resource, {
					methods: {}
				});

				_.defaults(options.resource.methods, _.clone(DEFAULT_METHODS, true));

				_.forEach(options.resource.methods, function(method, name) {
					if (!method) {
						delete options.resource.methods[name];
						return;
					}

					method.interceptor = method.interceptor || {};

					method.interceptor.response = transform(method.interceptor.response);
				});

				var Resource = $resource(options.resource.path, options.resource.defaultParameters, options.resource.methods);

				var proto = new Resource();

				Model.prototype = Object.create(proto, {
					constructor: {
						value: Model
					},
					toJSON: {
						value: function() {
							var result = proto.toJSON.apply(this);

							_.forEach(options.ignoreProperties, function(prop) {
								delete result[prop];
							});

							return result;
						}
					}
				});

				// add sugar method:
				// $delete -> delete
				// $save -> save
				_.forEach(options.resource.methods, function(method, name) {
					if (method) {
						if (_.isFunction(Model.prototype['$' + name])) {
							proto[name] = proto['$' + name];
						}
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
