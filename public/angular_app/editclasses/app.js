// //show error notify
// function showError($scope, $timeout, r) {
// 	$scope.serverRes = true;
// 	$timeout(function() {
// 		$scope.serverRes = false;
// 	}, 3000);
// 	$scope.serverMsg = r.err;
// }

// //show Server Msg
// function showMsg($scope, $timeout, r) {
// 	$scope.serverRes = true;
// 	$timeout(function() {
// 		$scope.serverRes = false;
// 	}, 3000);
// 	$scope.serverMsg = r.res;
// }


// // app.js
// // create angular app
var editClassApp = angular.module('editClassApp', ['angularUtils.directives.dirPagination']);

editClassApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

// create angular controller
editClassApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 4 // this should match however many results your API puts on one page
    $scope.showClass = false;
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.editClassfunc = function(isValid) {
        if (isValid) {
            $http.put('/class', $scope.class).
            success(function(data, status, headers, config) {
                if (data.res == "Class Updated!") {
                    $scope.serverMsg = data.res;           
                } else {
                    $scope.serverMsg = data.err;
                }

            }).
            error(function(data, status, headers, config) {
                
            });
        }
    }

    $scope.getClass = function(id) {
        $http.get('/class/' + id)
            .then(function(result) {
                $scope.class = result.data;
                $scope.showClass = true;
            });
    }

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        // $http.get('/class?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/class?page=' + pageNumber)
            .then(function(result) {
                $scope.users = result.data.classes;
                $scope.totalUsers = result.data.count;
            });
    }

}]);