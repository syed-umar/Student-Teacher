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


// app.js
// create angular app
var editClassApp = angular.module('editClassApp', []);


// create angular controller
editClassApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.serverRes = false;
	$scope.serverMsg = '';
	$scope.class_id = class_id;
	$scope.class;

	//console.log(class_id);

	var getUrl = '/class/' + class_id;

	$http.get(getUrl).
	success(function(data, status, headers, config) {
		$scope.class = data;
	}).
	error(function(data, status, headers, config) {
		showError($scope, $timeout, data);
	});


	// function to submit the form after all validation has occurred            
	$scope.editClassfunc = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {

			//console.log($scope.class);

			$http.put('/class', $scope.class).
			success(function(data, status, headers, config) {
				if (data.res == "Class Updated!") {
					showMsg($scope, $timeout, data);
				} else {
					showError($scope, $timeout, data);
				}

			}).
			error(function(data, status, headers, config) {
				showError($scope, $timeout, data);
			});
		}

	};

}]);