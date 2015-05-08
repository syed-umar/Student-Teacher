

// app.js
// create angular app
var finduserapp = angular.module('finduserapp', []);


// create angular controller
finduserapp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.serverRes = '';
	$scope.serverMsg = '';
	$scope.showDetails = false;

	$scope.findUser = function() {
		$http.get('/getUserByEmail/' + $scope.email)
		.success(function(data){
			if(data.status == 'ok'){
				// console.log(data);
				$scope.user = data.data
				$scope.showDetails = true;
			} else {
				alert(data);
			}
		});
	};
}]);