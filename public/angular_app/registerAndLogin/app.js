//initial loading indicator
var routeLoadingIndicator = function($rootScope) {
    return {
        // restrict:'E',
        template: "<span ng-if='isRouteLoading'>Loading...</span>",
        link: function(scope, elem, attrs) {
            scope.isRouteLoading = false;

            $rootScope.$on('$routeChangeStart', function() {
                scope.isRouteLoading = true;
            });

            $rootScope.$on('$routeChangeSuccess', function() {
                scope.isRouteLoading = false;
            });
        }
    };
};

var authApp = angular.module('authApp', ['ngRoute']);

authApp.directive("loadingIndicator", routeLoadingIndicator);

authApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'angular_app/registerAndLogin/login.html'
        }).
        when('/register', {
            templateUrl: 'angular_app/registerAndLogin/register.html'
        }).
        when('/login', {
            templateUrl: 'angular_app/registerAndLogin/login.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

// create angular controller
authApp.controller('loginController', function($scope, $http, $location) {
	$scope.serverMsg = null;

	if(logged_in == '0'){

	} else {
		$location.path('/register');
	}

	$scope.doLogin = function(){
		$http.post('/login', {
			email: $scope.email,
			password: $scope.password,
			remember: $scope.remember
		}).
		success(function(res){
			// console.log(data);
			if(res.status == 'logged in'){
				window.location.href = '/';
			}
		});
	}
});

// create angular controller
authApp.controller('registerController', function($scope, $http) {
	$scope.serverMsg = null;
});


