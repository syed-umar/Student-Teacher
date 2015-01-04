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
	// $scope.class_id = class_id;
	$scope.classes;

	$scope.selectClass = function(id){
		console.log(id);
	}



}]);