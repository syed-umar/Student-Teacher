

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
    $scope.showFiles = false;

    $scope.uploadFile = function() {
        // var files = $scope.myFiles;
        // console.log(document.getElementById('classFiles').files.length);
        // console.log('file is ' + JSON.stringify(file));
        $scope.uploadResults = '';

        $scope.uploadStatus = 'Uploading ...';

        var uploadUrl = "/classFilesUpload/" + $scope._class._id;
        // fileUpload.uploadFileToUrl(files, uploadUrl, $scope);
        var ins = document.getElementById('classFiles').files.length;
        var fd = new FormData();

        for(var x=0;x<ins;x++){
           fd.append("fileToUpload[]", document.getElementById('classFiles').files[x]);
        }

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data) {
                // console.log(data);
                $scope.uploadResults = data;
                $scope.uploadStatus = '';
                $scope.getClassFiles();
            })
            .error(function(data) {
                $scope.uploadStatus = data;
            });
    };

    // get Courses
    $http.get('/course/list')
        .success(function(courses) {
            $scope.courses = courses;
        });

    $scope.getCourse = function(course){
        $scope.course = course;
        $scope.getClassRegList(course._id);
        $scope.showAddClass = true;
        $scope.showFiles = false;
        $scope.uploadResults = '';
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
                $scope.showFiles = true;
                $scope.getClassFiles();
                $scope.uploadResults = '';
            }
        }); 
    }

    $scope.getClassFiles = function(){
        $http.get('/getClassFiles/' + $scope._class._id)
        .success(function(res){
            $scope.classFiles = res.files;
            // $scope.uploadResults = '';
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

    // Delete File
    $scope.deleteFile = function(fileName){
        // console.log(file); /deleteFileInClass/:classID/:fileName
        $http.get('/deleteFileInClass/' + $scope._class._id + '/' + fileName)
        .success(function(res){
            if(res.status == 'error'){
                alert(JSON.stringify(res.error));
            } else {
                alert('File was deleted!');
            }
            $scope.getClassFiles()
        });
    }

}]);