var ClassReg = require('../models/classRegistration');

module.exports = function(app) {

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
     * GET one classRegistration by ID
     */
    app.get('/classRegistration/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            class_id: _id
        }, function(err, classReg) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {
                res.json(classReg);
            }
        });
    });

    /*
     * GET teachers
     */
    app.get('/getTeachersInClass/:id', function(req, res) {

        var _id = req.param('id');

        ClassReg.findOne({
            class_id: _id
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
            class_id: _id
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
            class_id: class_id
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
                                classReg.class_id = class_id;

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
                                classReg.class_id = class_id;

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

                newClassReg.class_id = class_id;

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
    app.delete('/classRegistration/deleteTeacher/:class_id/:user_id', function(req, res) {

        var class_id = req.param('class_id');
        var user_id = req.param('user_id');

        ClassReg.findOne({
            'class_id': class_id,
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
    app.delete('/classRegistration/deleteStudent/:class_id/:user_id', function(req, res) {

        var class_id = req.param('class_id');
        var user_id = req.param('user_id');

        ClassReg.findOne({
            'class_id': class_id,
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
