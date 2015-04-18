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
var sessionApp = angular.module('sessionApp', ['ui.date', 'xeditable', 'angularUtils.directives.dirPagination']);

sessionApp.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

sessionApp.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('/bower_components/angular-utils-pagination/dirPagination.tpl.html');
});

sessionApp.controller('mainController', function($scope, $filter, $http) {

    $scope.openedstart = false;
    $scope.sessions = [];
    $scope.totalSessions = 0;
    $scope.sessionsPerPage = 5 // this should match however many results your API puts on one page
    $scope.showClass = false;
    $scope.showAddForm = false;
    $scope.showClasses = false;

    $scope.pagination = {
        current: 1
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

    $scope.model = { selected : {}};

     // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (session) {
        if (session._id === $scope.model.selected._id) return 'edit.html';
        else return 'display.html';
        // return 'display.html';
    };

    $scope.editContact = function (session) {
        $scope.model.selected = angular.copy(session);
        // console.log(session);
    };

    $scope.reset = function () {
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

    $scope.addSession = function(){
    	var newSession = $scope.newSession;
    	
    	newSession.classID = $scope._class._id;
    	newSession.sessionID = $scope.randomStr();

    	$http.post('/addSession', {
                newSession: newSession
            })
            .success(function(data) {
                // reset form
                if(data == 'added'){
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

        // if (typeof sessionid === "undefined") {
        //     // add new 
        //     $http.post('/saveSession', {
        //             newSession: newSession
        //         })
        //         .success(function(data) {
                    
        //         });
        // } else {
        //     // update

        //     newSession.id = sessionid;
        //     $http.post('/updateSession', {
        //             Session: newSession
        //         })
        //         .success(function(data) {
                    
        //         });
        // }




    };


    // add new 

    // save

    // pagination
});

/*
// create angular controller
sessionApp.controller('mainController', function($scope, $filter, $http) {
	$scope.users = [
    {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
    {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
    {id: 3, name: 'awesome user3', status: 2, group: null}
  ]; 

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ]; 

  $scope.groups = [];
  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function(user) {
    if(user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };
});*/
