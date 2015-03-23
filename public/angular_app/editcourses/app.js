

//show Server Msg
function showMsg($scope, $timeout, r) {
    $scope.serverRes = true;
    $timeout(function() {
        $scope.serverRes = false;
    }, 3000);
    $scope.serverMsg = r.res;
}


// // app.js
// // create angular app
var editCourseApp = angular.module('editCourseApp', ['angularUtils.directives.dirPagination', 'ui.date']);

editCourseApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

// create angular controller
editCourseApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.openedstart = false;
    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 10 // this should match however many results your API puts on one page
    $scope.showClass = false;
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    
    $scope.editCoursefunc = function(isValid) {
        if (isValid) {
            $http.put('/course', $scope.course).
            success(function(data) {
                if (data.res == "course Updated!") {
                    $scope.serverMsg = data.res;
                    showMsg($scope, $timeout, data);           
                } else {
                    showMsg($scope, $timeout, data);
                }

            }).
            error(function(data) {
                
            });
        }
    }

    $scope.getCourse = function(id) {
        $http.get('/course/' + id)
            .then(function(result) {
                $scope.course = result.data;
                $scope.showClass = true;
            });
    }

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        // $http.get('/class?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/course?page=' + pageNumber)
            .then(function(result) {
                $scope.users = result.data.courses;
                $scope.totalUsers = result.data.count;
            });
    }


}]);