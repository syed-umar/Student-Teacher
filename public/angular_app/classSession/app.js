//show Server Msg
function showMsg($scope, $timeout, r) {
    $scope.serverRes = true;
    $timeout(function() {
        $scope.serverRes = false;
    }, 3000);
    $scope.serverMsg = r.res;
}


// app.js
// create angular app
var sessionApp = angular.module('sessionApp', ['ui.date', 'angularUtils.directives.dirPagination', 'ui.bootstrap']);

sessionApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});



sessionApp.controller('mainController', function($scope, $filter, $http) {

    $scope.openedstart = false;
    $scope.newSession = {};
    $scope.sessions = [];
    $scope.totalSessions = 0;
    $scope.sessionsPerPage = 5 // this should match however many results your API puts on one page
    $scope.showClass = false;
    $scope.showAddForm = false;
    $scope.showClasses = false;

    $scope.pagination = {
        current: 1
    };

    // Time picker

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.mytime = d;
    };

    $scope.changed = function(){
        $scope.newSession.startTime = $scope.mytime;
        $scope.newSession.startTime = $filter('date')($scope.mytime, "shortTime"); ;
        //console.log($scope.newSession.startTime);
    }

    $scope.clear = function() {
        $scope.mytime = null;
    };


    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        // $http.get('/class?page=' + pageNumber + '&perpage=' + $scope.usersPerPage)
        $http.get('/getClassSessions/' + $scope._class._id + '?page=' + pageNumber)
            .then(function(result) {
                $scope.sessions = result.data.sessions;
                $scope.totalSessions = result.data.count;
            });
    }

    // get course
    $http.get('/course/list')
        .success(function(courses) {
            $scope.courses = courses;
        });

    // get classes
    $scope.getCourse = function(course) {
        $scope.course = course;
        $scope.showAddForm = false;
        $scope.showClasses = false;
        $scope.getClassRegList();
    }

    // Update the Class list drop down
    $scope.getClassRegList = function() {
        $http.get('/getClassRegList/' + $scope.course._id)
            .success(function(res) {
                if (res.status != "error") {
                    $scope.classes = res;
                }
            });
    }

    // get details of a class
    $scope.getClass = function(_class) {
        // console.log(_class);
        $scope._class = _class;
        $scope.showAddForm = true;
        $scope.showClasses = true;
        getResultsPage(1);

    }

    $scope.model = {
        selected: {}
    };

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function(session) {
        if (session._id === $scope.model.selected._id) return 'edit.html';
        else return 'display.html';
        // return 'display.html';
    };

    $scope.editContact = function(session) {
        $scope.model.selected = angular.copy(session);
        // console.log(session);
    };

    $scope.reset = function() {
        $scope.model.selected = {};
    };

    // add user
    $scope.addUser = function() {
        $scope.inserted = {
            classID: $scope._class._id,
            sessionID: $scope.randomStr(),
            sessionDate: '',
            startTime: '',
            duration: '',
            comments: '',
            notification: ''
        };
        $scope.sessions.push($scope.inserted);
        console.log($scope.sessions);
    };

    $scope.randomStr = function() {
        var Str = '';
        var availableSymbols = "abcdefghijklmnopqrstuvwxyz0987654321";
        for (var i = 0; i < 8; i++) {
            var symbol = availableSymbols[(Math.floor(Math.random() * availableSymbols.length))];
            Str += symbol;
        }
        return Str;
    }

    $scope.addSession = function() {
        var newSession = $scope.newSession;

        newSession.classID = $scope._class._id;
        newSession.sessionID = $scope.randomStr();

        $http.post('/addSession', {
                newSession: newSession
            })
            .success(function(data) {
                // reset form
                if (data == 'added') {
                    alert('Session added');
                } else {
                    alert(data);
                }
            });
    }

    $scope.updateSession = function(data) {
        //$scope.user not updated yet
        // console.log('id ' +sessionid);

        var newSession = data;
        newSession.classID = $scope._class._id;
        // console.log(data);

        // newSession.id = sessionid;
        $http.post('/updateSession', {
                Session: newSession
            })
            .success(function(data) {
                $scope.reset();
            });

    };

   

});
