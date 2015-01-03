var User = require('../models/user');

module.exports = function(app) {

        /*
         * GET userlist.
         */
        app.get('/user', function(req, res) {

            User.find(function(err, users) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(users);
                }
            });
        });

        /*
         * GET one user by ID
         */
        app.get('/user/:id', function(req, res) {

            var _id = req.param('id');

            User.findOne({
                _id: _id
            }, function(err, user) {
                // if there are any errors, return the error
                if (err) {
                    res.send(err);
                } else if (user) {
                    res.json(user);
                }
            });
        });

        /*
         * POST to add
         */
        app.post('/user', function(req, res) {


            var email = req.param('email', 'err');
            var password = req.param('password', 'err');
            var firstname = req.param('firstname', null);
            var lastname = req.param('lastname', null);
            var phone = req.param('phone', null);
            var skype = req.param('skype', null);
            var usertype = req.param('type', null);
            var userID = req.param('userID', null);
            var student_schoolName = req.param('student_schoolName', null);
            var student_guardianInfo = req.param('student_guardianInfo', null);
            var student_grade = req.param('student_grade', null);
            var teacher_availability = req.param('teacher_availability', null);
            var teacher_qualification = req.param('teacher_qualification', null);
            var teacher_grade = req.param('teacher_grade', null);
            var teacher_description = req.param('teacher_description', null);
            //var teacher_attachments = req.param('teacher_attachments', null);

            User.findOne({
                'local.email': email
            }, function(err, user) {
                // if there are any errors, return the error

                if (err) {
                    res.send(err);
                } else if (user) {
                    res.json({
                        res: "That email is already taken"
                    });
                } else {
                    var newUser = new User();

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.firstName = firstname;
                    newUser.local.lastName = lastname;
                    newUser.local.phone = phone;
                    newUser.local.skype = skype;
                    newUser.local.userType = usertype;
                    newUser.local.userID = userID;
                    newUser.local.student_schoolName = student_schoolName;
                    newUser.local.student_guardianInfo = student_guardianInfo;
                    newUser.local.student_grade = student_grade;
                    newUser.local.teacher_availability = teacher_availability;
                    newUser.local.teacher_qualification = teacher_qualification;
                    newUser.local.teacher_qualification = teacher_qualification;
                    newUser.local.teacher_grade = teacher_grade;
                    newUser.local.teacher_description = teacher_description;


                    //save the user
                    newUser.save(function(err) {
                        if (err) {
                            res.json({
                                response: err
                            });

                        } else {
                            // res.send('User added!');
                            res.status(200).send('User added!');
                        }
                    });
                }
            });
        });


        /*
         * POST to deleteuser.
         */

        app.put('/user', function(req, res) {


            var _id = req.param('id');
            var email = req.param('email', null);
            // var password = req.param('password', null);
            var firstName = req.param('firstName', null);
            var lastName = req.param('lastName', null);
            var phone = req.param('phone', null);
            var skype = req.param('skype', null);
            // var usertype = req.param('usertype', null);
            // var userID = req.param('userID', null);
            var student_schoolName = req.param('student_schoolName', null);
            var student_guardianInfo = req.param('student_guardianInfo', null);
            var student_grade = req.param('student_grade', null);
            var teacher_availability = req.param('teacher_availability', null);
            var teacher_qualification = req.param('teacher_qualification', null);
            var teacher_description = req.param('teacher_description', null);
            // var teacher_attachments = req.param('teacher_attachments');

            User.findOne({
                _id: _id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                } else if (user) {

                    //var bcrypt = require('bcrypt-nodejs');
                    //user.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

                    if (email != null) {
                        user.local.email = email;
                    }
                    if (firstName != null) {
                        user.local.firstName = firstName;
                    }
                    if (lastName != null) {
                        user.local.lastName = lastName;
                    }
                    if (phone != null) {
                        user.local.phone = phone;
                    }
                    if (skype != null) {
                        user.local.skype = skype;
                    }
                    if (student_schoolName != null) {
                        user.local.student_schoolName = student_schoolName;
                    }
                    if (student_guardianInfo != null) {
                        user.local.student_guardianInfo = student_guardianInfo;
                    }
                    if (student_grade != null) {
                        user.local.student_grade = student_grade;
                    }
                    if (student_guardianInfo != null) {
                        user.local.student_guardianInfo = student_guardianInfo;
                    }
                    if (student_grade != null) {
                        user.local.student_grade = student_grade;
                    }
                    if (teacher_availability != null) {
                        user.local.teacher_availability = teacher_availability;
                    }
                    if (teacher_qualification != null) {
                        user.local.teacher_qualification = teacher_qualification;
                    }
                    if (teacher_description != null) {
                        user.local.teacher_description = teacher_description;
                    }


                    // save the user
                    user.save(function(err) {
                        if (err) {
                            res.send({
                                "err": err
                            });
                        } else {
                            res.send({
                                "res": 'User updated!'
                            });
                        }
                    });
                }
            });

        });


        /*
         * Change Password
         */
        app.put('/changepassword', function(req, res) {
            if (req.isAuthenticated()) {

                var _id = req.param('id');
                var newpassword = req.param('password');
                var oldpassword = req.param('oldpassword');

                User.findOne({
                    _id: _id
                }, function(err, user) {
                    if (err) {
                        res.send(err);
                    } else if (user) {
                        if (user._id == req.user.id) {

                            var bcrypt = require('bcrypt-nodejs');

                            //check old password match
                            if (bcrypt.compareSync(oldpassword, user.local.password)) {
                                user.local.password = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null);

                                // save the user
                                user.save(function(err) {
                                    if (err) {
                                        res.send({
                                            "err": err
                                        });
                                    } else {
                                        res.send({
                                            "res": 'Password updated!'
                                        });
                                    }
                                });
                            } else {
                                res.send({
                                    "res": 'Password didn\'t match'
                                });
                            }



                        } else {
                            res.send({
                                "res": "ID missmatch"
                            });
                        }
                    }
                });
            } else {
                res.send({
                    "res": "Not Logged In"
                });
            }
        });
        /*
         * DELETE to deleteuser.
         */
        app.delete('/user/:email', function(req, res) {

            var email = req.param('email');

            User.remove({
                'local.email': email
            }, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('User removed!');
                }
            });

        });

    }
    // module.exports = router;