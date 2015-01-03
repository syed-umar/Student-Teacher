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



//show error notify
function showError($scope, $timeout, r) {
	$scope.serverRes = true;
	$timeout(function() {
		$scope.serverRes = false;
	}, 3000);
	$scope.serverMsg = r.err;
}

//show Server Msg
function showMsg($scope, $timeout, r) {
	$scope.serverRes = true;
	$timeout(function() {
		$scope.serverRes = false;
	}, 3000);
	$scope.serverMsg = r.res;
}

//show Server Msg
function showPasswordMsg($scope, $timeout, r) {
	$scope.passwordFormMsg = true;
	$timeout(function() {
		$scope.passwordFormMsg = false;
	}, 3000);
	$scope.passwordFormRes = r.res;
}


// app.js
// create angular app
var editProfileApp = angular.module('editProfileApp', ['DataService', 'ngAnimate']);

editProfileApp.directive("repeatPassword", function() {
	return {
		require: "ngModel",
		link: function(scope, elem, attrs, ctrl) {
			var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

			ctrl.$parsers.push(function(value) {
				if (value === otherInput.$viewValue) {
					ctrl.$setValidity("repeat", true);
					return value;
				}
				ctrl.$setValidity("repeat", false);
			});

			otherInput.$parsers.push(function(value) {
				ctrl.$setValidity("repeat", value === ctrl.$viewValue);
				return value;
			});
		}
	};
});

// create angular controller
editProfileApp.controller('mainController', ['$scope', '$http', '$timeout', 'User', function($scope, $http, $timeout, User) {

	$scope.user = new User();
	$scope.serverRes = false;
	$scope.serverMsg = '';
	$scope.user.type = 'student';
	$scope.user_id = user_id;

	//password form
	$scope.passwordFormMsg = false;
	// $scope.newpass = '';
	// $scope.oldpass = '';


	// function to submit the form after all validation has occurred            
	$scope.editFormfunc = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {

			//set user id
			$scope.user.id = $scope.user_id;
			User.update($scope.user).$promise.then(function(r) {
				if (r.res == "User updated!") {
					showMsg($scope, $timeout, r);
				} else {
					showError($scope, $timeout, r);
				}
				//console.log(r);

			}, function(r) {
				console.log("Server returned: " + r.status);
			});


		}

	};

	// function to submit the form after all validation has occurred            
	$scope.passwordFormfunc = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {

			//set user id
			$scope.user.id = $scope.user_id;

			$http.put('/changepassword', {
				id: $scope.user_id,
				password: $scope.repass,
				oldpassword: $scope.oldpass 
			}).
			success(function(data, status, headers, config) {
				showPasswordMsg($scope, $timeout, data);
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});


		}

	};

	//console.log(user);

	User.get({
		"id": $scope.user_id
	}).$promise.then(function(user) {
		$scope.user = user.local;
		$scope.user.type = user.local.userType;
		$scope.user.password = '';
	});



}]);