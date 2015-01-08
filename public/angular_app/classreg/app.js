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


// create angular app
var classRegApp = angular.module('classRegApp', []);

// create angular controller
classRegApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.serverRes = false;
	$scope.serverMsg = '';
	$scope.class;
	$scope.users = [];
	$scope.user_id;
	$scope.currentUser;

	$http.get('/class/list')
		.success(function(classes) {
			$scope.classes = classes;
		});

	$http.get('/user/list/students')
		.success(function(students) {
			$scope.students = students;
		});

	$http.get('/user/list/teachers')
		.success(function(teachers) {
			$scope.teachers = teachers;
		});

	$scope.getClass = function(_class) {
		$scope.class = _class;
	}

	$scope.getUser = function(user) {
		
		if (user == 0) {

		} else if (user == "student") {
			$scope.users = $scope.students;
		} else if (user == "teacher") {
			$scope.users = $scope.teachers;
		}
	}

	$scope.setUser = function(user){
		$scope.user_id = user._id;
		$scope.currentUser = user;
		console.log($scope.currentUser);
	}


}]);