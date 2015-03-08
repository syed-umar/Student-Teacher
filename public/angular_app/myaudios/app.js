

//show Server Msg
function showMsg($scope, $timeout, r) {
    $scope.serverRes = true;
    $timeout(function() {
        $scope.serverRes = false;
    }, 3000);
    $scope.serverMsg = r;
}


// // app.js
// // create angular app
var myAudioApp = angular.module('myAudioApp', ['angularUtils.directives.dirPagination']);

myAudioApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

// create angular controller
myAudioApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.user_id = user_id;

    $scope.openedstart = false;
    $scope.clips = [];
    $scope.totalClips = 0;
    $scope.usersPerPage = 2 // this should match however many results your API puts on one page
    $scope.showClass = true;
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.makeAudioSrc = function(file){
        var src = 'uploads/' + $scope.user_id + '/files/' + file;
        return src;
    }

    $scope.check = function(id){

        // var _id = '#'+id;
        // console.log(id);

        // console.log(angular.element("li[id^='"+id+"']"));
        angular.element("li[id^='"+id+"']").slideUp();
    }

    $scope.deleteClip = function(id){
        $http.get('/deleteClip/' + id).
        success(function(data) {
            if(data == 'deleted'){
                showMsg($scope, $timeout, data);
                angular.element("li[id^='"+id+"']").slideUp();
            } else {
                showMsg($scope, $timeout, data);
            }
        }).
        error(function(data) {
            showMsg($scope, $timeout, data);
        });
    }

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        // $http.get('/class?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/audioclips?page=' + pageNumber)
            .then(function(result) {
                $scope.clips = result.data.clips;
                $scope.totalClips = result.data.count;
            });
    }


}]);