
var DataService = angular.module('DataService', ['ngResource']);

DataService.factory('Classes', ['$resource', function($resource){
	return $resource('/api/classes/:id');
}]);


var main = angular.module('Mainapp', ['DataService']);



main.controller('MainCtrl', ['$scope', 'Classes', function($scope, Classes) {
	$scope.editing = false;
	$scope.text = "some text";

	Classes.query(function() {
    	//console.log(ClassList.data);
  	}).$promise.then(function(r){
  		
  	}); //query() returns all the entries

}]);


