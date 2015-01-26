//show error notify
function showError($scope, $timeout, r) {
	$scope.serverRes = true;
	$timeout(function() {
		$scope.serverRes = false;
	}, 3000);
	$scope.serverMsg = r;
}

//show Server Msg
function showMsg($scope, $timeout, r) {
	$scope.serverRes = true;
	$timeout(function() {
		$scope.serverRes = false;
	}, 3000);
	$scope.serverMsg = r;
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

		//get class reg info
		$scope.updateLists();
	}

	$scope.getUser = function(user) {

		if (user == 0) {

		} else if (user == "student") {
			$scope.users = $scope.students;
		} else if (user == "teacher") {
			$scope.users = $scope.teachers;
		}
	}

	$scope.setUser = function(user) {
		$scope.user_id = user._id;
		$scope.currentUser = user;

		if (user.local.userType == 'student') {
			$scope.classRegtype = 'student';
		} else if (user.local.userType == 'teacher') {
			$scope.classRegtype = 'teacher';
		}
		//console.log($scope.currentUser);
	}

	$scope.updateLists = function(){
		//get class reg info
		$http.get('/getTeachersInClass/'+ $scope.class._id)
		.success(function(teachers) {
			$scope.class_teachers = teachers;
		});

		$http.get('/getStudentsInClass/'+ $scope.class._id)
		.success(function(students) {
			$scope.class_students = students;
		});
	}

	$scope.addUser = function() {
		$http.post('/classRegistration/add', {
			class_id: $scope.class._id,
			user: $scope.currentUser,
			classRegtype: $scope.classRegtype
		}).
		success(function(data, status, headers, config) {
			// if (data.res == "Class added!") {
			// 	showMsg($scope, $timeout, data);
			// } else {
			// 	showError($scope, $timeout, data);
			// }
			showMsg($scope, $timeout, data);

			$scope.updateLists();

		}).
		error(function(data, status, headers, config) {
			// showError($scope, $timeout, data);
			showMsg($scope, $timeout, data);
		});
	}


}]);