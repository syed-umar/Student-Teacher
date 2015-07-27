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
var classRegApp = angular.module('classRegApp', ['ui.date']);

// create angular controller
classRegApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.serverRes = false;
	$scope.serverMsg = '';
	$scope.course;
	$scope.users = [];
	$scope.user_id;
	$scope.currentUser;
	$scope.selectType = false;
	// $scope.showCreateClass = false;
	// $scope.showClassReg = false;
	$scope._class;

	$http.get('/course/list')
		.success(function(courses) {
			$scope.courses = courses;
		});

	$http.get('/user/list/students')
		.success(function(students) {
			$scope.students = students;
		});

	$http.get('/user/list/teachers')
		.success(function(teachers) {
			$scope.teachers = teachers;
		});

	//select Course
	$scope.getCourse = function(_course) {
		$scope.course = _course;
		// $scope.showCreateClass = false;
		// $scope.showClassReg = false;

		// get class reg
		// $http.get('/classRegistration/' + $scope.course._id)
		// .success(function(res){
		// 	if(res == "not found"){
		// 		$scope.showCreateClass = true;
		// 	} else {
		// 		$scope.showClassReg = true;
		// 		$scope.classReg = res;
		// 	}
		// });

		//get class reg info
		$scope.getClassRegList();
		
		// reset teacher/student list
		$scope.class_teachers = [];
		$scope.class_students = [];
	}

	// Create a New class in course
	$scope.createClassReg = function(){
		$http.post('/createClassReg', {
			id: $scope.course._id,
			school: $scope.course.schoolName,
			classReg: $scope.classReg
		})
		.success(function(res){
			if(res.status == "created"){
				//console.log(added);
				// $scope.showClassReg = true;
				// $scope.showCreateClass = false;
				$scope.getClassRegList();
				$scope.classReg = null;
				alert('Class Created');
				// $scope.classReg = res.data;	
			} else {
				alert(res);
			}
		});		
	}

	// Update the selected Class
	$scope.updateClassReg = function(_class){
		$http.post('/updateClassReg', {
			class: _class
		})
		.success(function(res){
			if(res == 'error'){
				alert('Problem updating Class');
			} else if(res == 'updated'){
				alert('Updated');
			} else {
				alert(res);
			}
		});
	}

	// Update the Class list drop down
	$scope.getClassRegList = function(){
		$http.get('/getClassRegList/' + $scope.course._id)
		.success(function(res){
			if(res.status != "error"){
				$scope.classes = res;
			}
		});	
	}

	// get details of a class
	$scope.getClass = function(_class){
		// console.log(_class);
		$http.get('/classReg/' + _class._id)
		.success(function(res){
			if(res == "not found"){
				
			} else {
				$scope._class = res;
				$scope.updateLists();
			}
		});	
	}

	// set user drop down
	$scope.getUser = function(user) {

		if (user == 0) {

		} else if (user == "student") {
			$scope.users = $scope.students;
		} else if (user == "teacher") {
			$scope.users = $scope.teachers;
		}
	}

	// Set the selected user + type
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

	// get User by Email
	$scope.findUser = function() {
        $http.get('/getUserByEmail/' + $scope.emailSearch)
            .success(function(res) {
                if (res.status == 'ok') {
                    $scope.currentUser = res.data;
                    $scope.selectType = true;
                    $scope.classRegtype = "student";
                } else if (res.status == 'err'){
                    alert(JSON.stringify(res.data));
                }
            });
    };

    $scope.setStudent = function(){
    	$scope.classRegtype = 'student';
    }

    $scope.setTeacher = function(){
    	$scope.classRegtype = 'teacher';
    }

	// Update the Teacher/Student List
	$scope.updateLists = function(){
		//get class reg info
		$http.get('/getTeachersInClass/'+ $scope._class._id)
		.success(function(teachers) {
			$scope.class_teachers = teachers;
		});

		$http.get('/getStudentsInClass/'+ $scope._class._id)
		.success(function(students) {
			$scope.class_students = students;
		});
	}

	// Add the user to class
	$scope.addUser = function() {

		// console.log($scope.classRegtype);
		
		$http.post('/classRegistration/add', {
			class_id: $scope._class._id,
			user: $scope.currentUser,
			classRegtype: $scope.classRegtype
		}).
		success(function(data) {
			
			//showMsg($scope, $timeout, data);
			alert(data);

			$scope.updateLists();
			$scope.selectType = false;

		}).
		error(function(data, status, headers, config) {
			// showError($scope, $timeout, data);
			showMsg($scope, $timeout, data);
		});
	}

	$scope.deleteTeacher = function(user_id){
		$http.delete('/classRegistration/deleteTeacher/'+ $scope.course._id + '/' + user_id)
		.success(function(data) {
			if(data == "removed"){
				$scope.updateLists();
			} else{
				alert('problem');
			}
		});
	}

	$scope.deleteStudent = function(user_id){
		$http.delete('/classRegistration/deleteStudent/'+ $scope.course._id + '/' + user_id)
		.success(function(data) {
			if(data == "removed"){
				$scope.updateLists();
			} else{
				alert('problem');
			}
		});
	}


}]);