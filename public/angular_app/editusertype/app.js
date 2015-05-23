// app.js
// create angular app
var finduserapp = angular.module('finduserapp', ['angularUtils.directives.dirPagination', 'ui.date']);

finduserapp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

// create angular controller
finduserapp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.serverRes = '';
    $scope.serverMsg = '';
    $scope.showDetails = false;
    $scope.deleteusers = {};

    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 5 // this should match however many results your API puts on one page
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // $http.get('/getusers?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/getUsers' + '?page=' + pageNumber)
            .success(function(res) {
                if (res.status == 'error') {
                    alert(res.err);
                } else if (res.status == 'ok') {
                    // console.log(res);
                    $scope.users = res.users;
                    $scope.totalUsers = res.count;
                }
            });
    }

    $scope.findUser = function() {
        $http.get('/getUserByEmail/' + $scope.email)
            .success(function(data) {
                if (data.status == 'ok') {
                    $scope.user = data.data
                    $scope.showDetails = true;
                } else {
                    alert(data);
                }
            });
    };

    $scope.deleteUsers = function() {
		$http.post('/deleteUsers', { deleteIDs: $scope.deleteusers } ).
		success(function(res){
			if(res.status == "error"){
				alert(res.error);
			} else if(res.status == 'ok'){
				alert('Users were deleted');
			}
		});
    }

}]);
