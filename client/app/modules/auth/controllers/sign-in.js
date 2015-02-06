;(function () {
	'use strict';

	var SignIn = function($location, $scope, Session) {

		$scope.credential = {
			email: '',
			password: ''
		};

		$scope.signIn = function() {

			Session.create($scope.credential).$promise.then(function onSuccess(session) {
				$location.url('/');
			});

		};

	};

	SignIn.$inject = [ '$location', '$scope', 'share.models.Session' ];

	angular.module('idea').controller('auth.SignIn', SignIn);
}());