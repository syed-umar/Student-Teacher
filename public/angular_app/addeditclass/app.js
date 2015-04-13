

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

// classApp.directive('fileModelFile', ['$parse', function($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var model = $parse(attrs.fileModelFile);
//             var modelSetter = model.assign;

//             element.bind('change', function() {
//                 scope.$apply(function() {

//                     //modelSetter(scope, element[0].files[0]);

//                     console.log(element[0].files.length);

//                     // for(i in element[0].files){
//                     //     var file = element[0].files[i];                        
//                     // }

//                     // var file = element[0].files[0];
//                     // console.log(file);

//                     //     //check type
//                     //     if(file.type == 'application/pdf' || file.type == 'application/msword' || file.type == 'application/vnd.oasis.opendocument.text'){
//                     //         //check size for images - 2mb
//                     //         if (file.size <= 5000000) {
//                     //             scope.Upload_file_btn = true;
//                                 modelSetter(scope, element[0].files);
//                     //             scope.uploadMsg_file = '';
//                     //         } else {
//                     //             scope.uploadMsg_file = 'Size must be less then 5 MB';
//                     //             scope.Upload_file_btn = false;
//                     //         }
//                     //     } else {
//                     //         scope.uploadMsg_file = 'Wrong format!';
//                     //         scope.Upload_file_btn = false;
//                     //     }
                    
//                 });
//             });
//         }
//     };
// }]);


// classApp.service('fileUpload', ['$http', function($http) {
//     this.uploadFileToUrl = function(files, uploadUrl, scope) {

//         console.log(files);

//         var ins = files.length;
//         var fd = new FormData();

//         // for(var x=0;x<ins;x++){
//         //     fd.append("fileToUpload[]", files[x]);
//         // }


        
//         console.log(fd);
//         //for(i in files){
            
//            fd.append('files[]', files[0]);
//             // console.log(files[i]);
//         // }

//         // console.log(fd);

//         $http.post(uploadUrl, fd, {
//                 transformRequest: angular.identity,
//                 headers: {
//                     'Content-Type': undefined
//                 }
//             })
//             .success(function(data) {
//                 console.log(data);
//                 if(data == 'Saved'){
//                     scope.uploadMsg = data;
//                     console.log(data);
//                 } else {
//                     scope.uploadMsg_file = data;
//                     console.log(data);
//                 }
//             })
//             .error(function(data) {
//                 console.log(data);
//             });

//     }
// }]);


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
            $scope.uploadResults = '';
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