var ClassReg = require('../models/classRegistration');

module.exports = function(app) {

    /*
     * GET list classes
     */
    app.get('/class/list', function(req, res) {
        var _Class = require('../models/class');
        _Class.find(function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_class) {
                res.json(_class);
            }
        });
    });

    /*
     * GET list
     */
    app.get('/classRegistration/list', function(req, res) {
        ClassReg.find(function(err, classReg) {
            if (err) {
                res.send(err);
            } else {
                res.json(classReg);
            }
        });
    });

    /*
     * GET one classRegistration by course ID
     */
    app.get('/classRegistration/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            course_id: _id
        }, function(err, classReg) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {
                res.json(classReg);
            } else {
                res.send('not found');
            }
        });
    });

    /*
     * GET one classRegistration by ID
     */
    app.get('/classReg/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            _id: _id
        }, function(err, classReg) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {
                res.json(classReg);
            } else {
                res.send('not found');
            }
        });
    });

    // getClassRegList
    app.get('/getClassRegList/:id', function(req, res){
        var course_id = req.param("id");

        ClassReg.find({
            course_id: course_id
        }, function(err, _class){
            if(err){
                res.send('error');
            } else if(_class){
                res.json(_class);
            } else {
                res.send('[]');
            }
        });
    });

    // create class reg
    app.post('/createClassReg', function(req, res) {
        var ID = req.param('id');
        var schoolName = req.param('school');

        var classReg = req.param('classReg');
        // console.log(classReg);

        // var startDate = req.param('startDate');
        // var endDate = req.param('endDate');
        // var classDay = req.param('classDay');
        // var duration = req.param('duration');
    
        var newClassReg = new ClassReg();

        newClassReg.course_id = ID;
        newClassReg.classID = schoolName + '_' + randomStr();
        newClassReg.startDate = classReg.startDate;
        newClassReg.endDate = classReg.endDate;
        newClassReg.classDay = classReg.classDay;
        newClassReg.duration = classReg.duration;
        newClassReg.startTime = classReg.startTime;

        var r = {};

        newClassReg.save(function(err, _class) {
            if (err) {
                console.log(err);
                r.status = 'error';
                res.send(r);
            } else {
                r.status = 'created';
                // console.log(_class);
                // r.data = _class;
                res.send(r);
            }
        });
    });

    function randomStr() {

        var password = '';
        var availableSymbols = "abcdefghijklmnopqrstuvwxyz0987654321"; // just so they're easier to type, I removed the !@#$%^&*
        for (var i = 0; i < 6; i++) {
            var symbol = availableSymbols[(Math.floor(Math.random() * availableSymbols.length))];
            password += symbol;
        }
        return password;
    }

    //update Class reg
    app.post('/updateClassReg', function(req, res) {
        var classReg = req.param('class');
        // console.log(_class);

        ClassReg.findOne({
            _id: classReg._id
        }, function(err, _class) {
            if (err) {
                res.send('error');
            } else if (_class) {
                // console.log(_class);
                if(classReg.classDay){ _class.classDay = classReg.classDay;}
                if(classReg.startDate){ _class.startDate = classReg.startDate;}
                if(classReg.endDate){ _class.endDate = classReg.endDate;}
                if(classReg.startTime){ _class.startTime = classReg.startTime;}
                if(classReg.duration){ _class.duration = classReg.duration;}
                
                _class.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send('error');
                    } else {
                        res.send('updated');
                    }
                });
            }
        });

    });

    /*
     * GET teachers
     */
    app.get('/getTeachersInClass/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            _id: _id
        }, function(err, classReg) {

            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {
                var User = require('../models/user');

                User
                    .find()
                    .select('local.firstName local.lastName')
                    .where('_id')
                    .in(classReg.teachers).exec(function(err, teachers) {
                        if (err) {
                            res.send(err);
                        } else if (teachers.length > 0) {
                            res.send(teachers);
                        } else {
                            res.send('[]');
                        }
                    });
            } else {
                res.send('[]');
            }


        });

        //res.end();
    });

    /*
     * GET students
     */
    app.get('/getStudentsInClass/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            _id: _id
        }, function(err, classReg) {

            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {
                var User = require('../models/user');
                // console.log(classReg);

                User
                    .find()
                    .select('local.firstName local.lastName')
                    .where('_id')
                    .in(classReg.students).exec(function(err, students) {
                        if (err) {
                            res.send(err);
                        } else if (students.length > 0) {
                            res.send(students);
                        } else {
                            res.send('[]');
                        }
                    });
            } else {
                res.send('[]');
            }


        });

        //res.end();
    });

    /*
     * POST Add User
     */
    app.post('/classRegistration/add', function(req, res) {

        var async = require('async');

        var user = req.param('user');
        var class_id = req.param('class_id');
        var classRegtype = req.param('classRegtype');

        // var id = req.param('id');

        ClassReg.findOne({
            _id: class_id
        }, function(err, classReg) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {

                //check duplicate addition

                if (classRegtype == "student") {

                    async.series([
                            function(callback) {
                                classReg.students.forEach(function(item) {
                                    if (item == user._id) {
                                        callback('found');
                                    }
                                });
                                callback(null);
                            },
                            function(callback) {
                                classReg.students.push(user._id);
                                callback(null);
                            }
                        ],
                        function(err, results) {
                            if (err) {
                                //console.log(err);
                                res.send('Student Already Added!');
                            } else {
                                // classReg.course_id = course_id;

                                // save the user
                                classReg.save(function(err) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        res.send('Class Registration Updated!');
                                    }
                                });
                            }
                        });

                } else if (classRegtype == "teacher") {
                    async.series([
                            function(callback) {
                                classReg.teachers.forEach(function(item) {
                                    if (item == user._id) {
                                        callback('found');
                                    }
                                });
                                callback(null);
                            },
                            function(callback) {
                                classReg.teachers.push(user._id);
                                callback(null);
                            }
                        ],
                        function(err, results) {
                            if (err) {
                                res.send('Teacher Already Added!');
                            } else {
                                // classReg.course_id = course_id;

                                // save the user
                                classReg.save(function(err) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        res.send('Class Registration Updated!');
                                    }
                                });
                            }
                        });
                }

            } else {

                //create new 
                var newClassReg = new ClassReg();

                if (user.local.userType == "student") {
                    newClassReg.students.push(user._id);
                } else if (user.local.userType == "teacher") {
                    newClassReg.teachers.push(user._id);
                }

                newClassReg.course_id = course_id;

                // save the user
                newClassReg.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('Class Registration Updated!');
                    }
                });
            }
        });
    });

    //check duplicate addition
    function checkDuplicate(id, users, cb) {

        users.forEach(function(item) {
            if (item == id) {
                console.log('found');
                cb('found');
            }
        });
    }

    /*
     * DELETE to delete User from reg.
     */
    app.delete('/classRegistration/deleteTeacher/:course_id/:user_id', function(req, res) {

        var course_id = req.param('course_id');
        var user_id = req.param('user_id');

        ClassReg.findOne({
            'course_id': course_id,
            'teachers': user_id
        }, function(err, item) {
            if (err) {
                res.send(err);
            } else {
                //res.send(item);
                var index = item.teachers.indexOf(user_id);
                if (index > -1) {
                    item.teachers.splice(index, 1);

                    // save the record
                    item.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('removed');
                        }
                    });
                } else {
                    res.send('error');
                }
            }
        });

    });

    /*
     * DELETE to delete User from reg.
     */
    app.delete('/classRegistration/deleteStudent/:course_id/:user_id', function(req, res) {

        var course_id = req.param('course_id');
        var user_id = req.param('user_id');

        ClassReg.findOne({
            'course_id': course_id,
            'students': user_id
        }, function(err, item) {
            if (err) {
                res.send(err);
            } else {
                //res.send(item);
                var index = item.students.indexOf(user_id);
                if (index > -1) {
                    item.students.splice(index, 1);

                    // save the record
                    item.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('removed');
                        }
                    });
                } else {
                    res.send('error');
                }
            }
        });

    });



    /*
     * DELETE to delete Class reg.
     */
    app.delete('/classRegistration/delete/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.remove({
            _id: _id
        }, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Class removed!');
            }
        });

    });



};
