

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
var ScoreApp = angular.module('ScoreApp', ['angularUtils.directives.dirPagination']);

ScoreApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

// create angular controller
ScoreApp.controller('mainController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    $scope.sort = "New";
    $scope.clips = [];
    $scope.totalClips = 0;
    $scope.usersPerPage = 3 // this should match however many results your API puts on one page
    $scope.showClass = true;
    $scope.clipsModel = [];
    getResultsPage(1);

    $scope.clipScore = "Select Score";

    $scope.pagination = {
        current: 1
    };

    $scope.makeAudioSrc = function(clip){
        var src = 'uploads/' + clip.student_id + '/files/' + clip.audioFile;
        return src;
    }

    $scope.change = function(){
        $http.get('/getAllClips?page=1&sort=' + $scope.sort)
            .then(function(result) {
                $scope.clips = result.data.clips;
                $scope.totalClips = result.data.count;
            });
    }

    $scope.updateScore = function(clip){
        //console.log($scope.clipsModel[clip]);
        var score = $scope.clipsModel[clip._id];
        
        $http.post('/updateScore', { id: clip._id, score: score}).
            success(function(data) {
                if(data.res == "updated"){
                    // showMsg($scope, $timeout, data);
                    alert(data);
                } else {
                    // showError($scope, $timeout, data);
                    alert(data);
                }
                
            }).
            error(function(data, status, headers, config) {
                // showError($scope, $timeout, data);
                alert(data);
            });

    }

    $scope.updateStatus = function(clip){
        var status = $scope.clipsModel[clip._id].status;

        $http.get('/updateStatus/' + clip._id + '/' + status)
        .success(function(data){
            if(data.res == "updated"){
                // showMsg($scope, $timeout, data);
                alert(data);
            } else {
                // showError($scope, $timeout, data);
                alert(data);
            }
        })
        .error(function(data){
            alert(data);
        })
    }

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        // $http.get('/class?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/getAllClips?page=' + pageNumber + '&sort=' + $scope.sort)
            .then(function(result) {
                $scope.clips = result.data.clips;
                $scope.totalClips = result.data.count;
            });
    }


}]);