var DataService = angular.module('DataService', ['ngResource']);

DataService.factory('User', ['$resource', function($resource) {
	return $resource('/user/:id', {
		id: '@_id'
	}, {
		update: {
			method: 'PUT' // this method issues a PUT request
		}
	});
}]);

// var main = angular.module('Mainapp', ['DataService']);

// main.controller('MainCtrl', ['$scope', 'Classes', function($scope, Classes) {
// 	$scope.editing = false;
// 	$scope.text = "some text";

// 	Classes.query(function() {
//     	//console.log(ClassList.data);
//   	}).$promise.then(function(r){

//   	}); //query() returns all the entries

// }]);

function notNull(prom) {
	return prom.then(function(res) {
		if (res === null) return $q.reject("Error, got null");
		return res;
	});
};


// app.js
// create angular app
var signupValidationApp = angular.module('signupValidationApp', ['DataService']);

// create angular controller
signupValidationApp.controller('mainController', ['$scope', 'User', function($scope, User) {

	$scope.user = new User();

	// function to submit the form after all validation has occurred            
	$scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {
			User.save($scope.user, function() {

			}).$promise.then(function(r) {
				console.log(r);
			});


		}

	};

}]);