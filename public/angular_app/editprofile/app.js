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


editProfileApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {

                    //modelSetter(scope, element[0].files[0]);

                    var file = element[0].files[0];

                        //check type
                        if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/gif') {
                            
							//check size for images - 2mb
                            if (file.size <= 2000000) {
                            	scope.Upload_btn = true;
                            	modelSetter(scope, element[0].files[0]);
                            	scope.uploadMsg = '';
                            } else {
                                scope.uploadMsg = 'Size must be less then 2 MB';
                                scope.Upload_btn = false;
                            }
                        } else {
                            scope.uploadMsg = 'Wrong format!';
                            scope.Upload_btn = false;
                        }
                    
                });
            });
        }
    };
}]);

editProfileApp.directive('fileModelFile', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModelFile);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {

                    //modelSetter(scope, element[0].files[0]);

                    var file = element[0].files[0];
                    // console.log(file);

                        //check type
                        if(file.type == 'application/pdf' 
                            || file.type == 'application/msword' 
                            || file.type == 'application/vnd.oasis.opendocument.text'
                            || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            ){
                        	//check size for images - 2mb
                            if (file.size <= 5000000) {
                            	scope.Upload_file_btn = true;
                            	modelSetter(scope, element[0].files[0]);
                            	scope.uploadMsg_file = '';
                            } else {
                                scope.uploadMsg_file = 'Size must be less then 5 MB';
                                scope.Upload_file_btn = false;
                            }
                        } else {
                            scope.uploadMsg_file = 'Wrong format!';
                            scope.Upload_file_btn = false;
                        }
                    
                });
            });
        }
    };
}]);


editProfileApp.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, scope) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .success(function(data) {
            	if(data == 'Saved pic'){
            		scope.uploadMsg = data;
            	} else {
            		scope.uploadMsg_file = data;
            	}
            })
            .error(function(data) {
            	alert(data);
            });
    }
}]);

/** Profile picture **/

// create angular controller
editProfileApp.controller('mainController', ['$scope', 'fileUpload', '$http', '$timeout', 'User', function($scope, fileUpload, $http, $timeout, User) {

    $scope.user = new User();
    $scope.serverRes = false;
    $scope.serverMsg = '';
    $scope.user.type = 'student';
    $scope.user_id = user_id;
    $scope.Upload_btn = false;
    $scope.Upload_file_btn = false;
    $scope.displayPage = false;

    //password form
    $scope.passwordFormMsg = false;


    $scope.uploadFile = function() {
        var file = $scope.myFile;
        // console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/user/uploadpic/"+ $scope.user_id;
        fileUpload.uploadFileToUrl(file, uploadUrl, $scope);
    };


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

        //display page
        // $scope.displayPage = true;
        $timeout(function() {
            $scope.displayPage = true;
            //console.log(angular.element('#app'));
            angular.element('#app').attr('style', 'display: block;');
        }, 2000);
    });



}]);
