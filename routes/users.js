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
            var usertype = req.param('usertype', null);
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
                    res.send('That email is already taken.');
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
                            res.send(err);
                        } else {
                            res.send('User added!');
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
            var password = req.param('password', null);
            var firstname = req.param('firstname', null);
            var lastname = req.param('lastname', null);
            var phone = req.param('phone', null);
            var skype = req.param('skype', null);
            var usertype = req.param('usertype', null);
            var userID = req.param('userID', null);
            var student_schoolName = req.param('student_schoolName', null);
            var student_guardianInfo = req.param('student_guardianInfo', null);
            var student_grade = req.param('student_grade', null);
            var teacher_availability = req.param('teacher_availability', null);
            var teacher_qualification = req.param('teacher_qualification', null);
            var teacher_grade = req.param('teacher_grade', null);
            var teacher_description = req.param('teacher_description', null);
            // var teacher_attachments = req.param('teacher_attachments');

            User.findOne({
                _id: _id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                } else if (user) {

                    var bcrypt = require('bcrypt-nodejs');

                    user.local.email = email;
                    user.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    if (firstname != null) {
                        user.local.firstName = firstname;
                    }
                    user.local.lastName = lastname;
                    user.local.phone = skype;
                    user.local.skype = skype;
                    user.local.userType = usertype;
                    user.local.userID = userID;
                    user.local.student_schoolName = student_schoolName;
                    user.local.student_guardianInfo = student_guardianInfo;
                    user.local.student_grade = student_grade;
                    user.local.teacher_availability = teacher_availability;
                    user.local.teacher_qualification = teacher_qualification;
                    user.local.teacher_qualification = teacher_qualification;
                    user.local.teacher_grade = teacher_grade;
                    user.local.teacher_description = teacher_description;

                    // save the user
                    user.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('User updated!');
                        }
                    });
                }
            });

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