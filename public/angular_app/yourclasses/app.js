// app.js
// create angular app
var validationApp = angular.module('validationApp', []);

// create angular controller
validationApp.controller('mainController', function($scope, $http) {

});

validationApp.controller('dataController', function($scope, $http, $timeout) {

	$scope.showClass = false;
	$scope.displayPage = false;

	$http.get('/getclassregs/' + user_id)
		.success(function(docs) {
			$scope.classes = docs;

			$timeout(function() {
				$scope.displayPage = true;
				//console.log(angular.element('#app'));
				angular.element('#app').attr('style', 'display: block;');
			}, 2000);

		})
		.error(function(err) {
			console.log(err);
		});

	$scope.showDetails = function(_class) {
		$scope.class = _class;
		$scope.showClass = true;

		$http.get('/getclassRegbyClassid/' + _class._id)
			.success(function(docs) {
				$scope.classReg = docs;
				$scope.getClassFiles();
				// console.log(docs);
			})
			.error(function(err) {
				console.log(err);
			});
	}

	$scope.getClassFiles = function(){
        $http.get('/getClassFiles/' + $scope.class._id)
        .success(function(res){
            $scope.classFiles = res.files;
            // $scope.uploadResults = '';
        });    
    }

	$scope.uploadFile = function() {
        // var files = $scope.myFiles;
        // console.log(document.getElementById('classFiles').files.length);
        // console.log('file is ' + JSON.stringify(file));
        $scope.uploadResults = '';

        $scope.uploadStatus = 'Uploading ...';

        var uploadUrl = "/classFilesUpload/" + $scope.class._id;
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

});