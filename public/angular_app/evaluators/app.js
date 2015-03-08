//show error notify
function showError($scope, $timeout, r) {
    $scope.serverRes = true;
    $timeout(function() {
        $scope.serverRes = false;
    }, 3000);
    $scope.serverMsg = r;
}

// create angular app
var EvaluatorApp = angular.module('EvaluatorApp', []);

// create angular controller
EvaluatorApp.controller('mainController', function($scope, $http, $timeout) {

    $scope.serverRes = false;
    $scope.serverMsg = '';
    $scope.users = [];
    $scope.evaluators = [];
    $scope.user;

    $http.get('/user/list/teachers')
        .success(function(users) {
            $scope.users = users;
        });

    $scope.getEvaluators = function() {
        $http.get('/getEvaluators')
            .success(function(users) {
                $scope.evaluators = users;
            });
    }

    $scope.getEvaluators();

    $scope.makeEvaluator = function() {
        
        $http.get('/makeEvaluator/' + $scope.user._id)
            .success(function(data) {
                if (data == 'added') {
                    showError($scope, $timeout, data);
                } else {
                    showError($scope, $timeout, data);
                }
                $scope.getEvaluators();
            })
            .error(function(data) {
                showError($scope, $timeout, data);
            });
    }

    $scope.removeEvaluator = function(id){
    	$http.get('/removeEvaluator/' + id)
            .success(function(data) {
                if (data == 'removed') {
                    showError($scope, $timeout, data);
                } else {
                    showError($scope, $timeout, data);
                }
                $scope.getEvaluators();
            })
            .error(function(data) {
                showError($scope, $timeout, data);
            });
    }

    $scope.setUser = function(user) {
        $scope.user = user;
    }
});
