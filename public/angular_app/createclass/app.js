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
var createClassApp = angular.module('createClassApp', ['ui.date']);


// create angular controller
createClassApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.serverRes = false;
	$scope.serverMsg = '';


	// function to submit the form after all validation has occurred            
	$scope.createClassfunc = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) {

			//console.log($scope.class);

			$http.post('/class', $scope.class).
			success(function(data, status, headers, config) {
				if(data.res == "Class added!"){
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