;(function() {
	'use strict';

	angular
			.module('idea', [ 'ngRoute' ])
			.config([ '$routeProvider', function($routeProvider) {

				$routeProvider.when('/', {
					redirectTo: '/dashboard'
				}).when('/dashboard', {
					controller: 'Dashboard',
					templateUrl: '/views/dashboard.html',
					resolve: {
						auth: ['$q', function($q) {
							console.log('x');
							// return $q.reject('/sign-in');
						} ]
					}
				}).when('/sign-in', {
					templateUrl: '/views/sign-in.html'
				});



			} ])
			.run([ '$rootScope', function($rootScope) {
				$rootScope.$on('$routeChangeError', function(e) {
					location.replace('/sign-in');
				});
			} ]);
}());