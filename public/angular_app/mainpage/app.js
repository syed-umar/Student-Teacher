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
				// console.log(docs);
			})
			.error(function(err) {
				console.log(err);
			});
	}

});