

//show Server Msg
function showMsg($scope, $timeout, r) {
    $scope.serverRes = true;
    $timeout(function() {
        $scope.serverRes = false;
    }, 3000);
    $scope.serverMsg = r.res;
}


// // app.js
// // create angular app
var classApp = angular.module('classApp', ['ui.date']);

// create angular controller
classApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.showAddClass = false;
    $scope.showEditClass = false;

    // get Courses
    $http.get('/course/list')
        .success(function(courses) {
            $scope.courses = courses;
        });

    $scope.getCourse = function(course){
        $scope.course = course;
        $scope.getClassRegList(course._id);
        $scope.showAddClass = true;
    }    

    $scope.getClassRegList = function(id){
        $http.get('/getClassRegList/'+ id)
        .success(function(classes) {
            $scope.classes = classes;
        });
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
                $scope.getClassRegList($scope.course._id);
                $scope.classReg = null;
                alert('Class Created');
            } else {
                alert(res);
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
                $scope.showEditClass = true;
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

}]);