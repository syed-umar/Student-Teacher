var DataService = angular.module('DataService', ['ngResource']);

DataService.factory('User', ['$resource', function($resource) {
	return $resource('/user/:id', {
		id: '@_id'
	}, {
		'update': {
			method: 'PUT'
		},
		'get': {
			method: 'GET',
			isArray: false
		}
	});
}]);




// app.js
// create angular app
var signupValidationApp = angular.module('signupValidationApp', ['DataService', 'ngAnimate']);

// create angular controller
signupValidationApp.controller('mainController', ['$scope', '$timeout', 'User', function($scope, $timeout, User) {

	$scope.user = new User();
	$scope.serverRes = false;
	$scope.serverMsg = '';

	// function to submit the form after all validation has occurred            
	$scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {
			User.save($scope.user).$promise.then(function(r) {
				// console.log(r.res);
				$scope.serverRes = true;
				$timeout(function() {
					$scope.serverRes = false;
				}, 3000);
				$scope.serverMsg = r.res;
			}, function(r) {
				console.log("Server returned: " + r.status);
			});


		}

	};

}]);