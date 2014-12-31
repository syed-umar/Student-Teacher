var User = require('../models/user');

module.exports = function(app) {

        /*
         * GET userlist.
         */
        app.get('/user/list', function(req, res) {

            User.find(function(err, users) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(users);
                }
            })
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
                    res.json(_class);
                }
            });
        });

        /*
         * POST to add
         */
        app.post('/user/add', function(req, res) {

            var email = req.param('email');
            var password = req.param('password');
            var firstname = req.param('firstname');
            var lastName = req.param('lastName');
            var phone = req.param('phone');
            var skype = req.param('skype');
            var type = req.param('type');
            var userID = req.param('userID');
            var student_schoolName = req.param('student_schoolName');
            var student_guardianInfo = req.param('student_guardianInfo');
            var student_grade = req.param('student_grade');
            var teacher_availability = req.param('teacher_availability');
            var teacher_qualification = req.param('teacher_qualification');
            var teacher_grade = req.param('teacher_grade');
            var teacher_description = req.param('teacher_description');
            // var teacher_attachments = req.param('teacher_attachments');

            User.findOne({
                'local.username': email
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
                    newUser.local.firstname = firstname;
                    newUser.local.lastName = lastName;
                    newUser.local.skype = skype;
                    newUser.local.type = type;
                    newUser.local.userID = userID;
                    newUser.local.student_schoolName = student_schoolName;
                    newUser.local.student_guardianInfo = student_guardianInfo;
                    newUser.local.student_grade = student_grade;
                    newUser.local.teacher_availability = teacher_availability;
                    newUser.local.teacher_qualification = teacher_qualification;
                    newUser.local.teacher_qualification = teacher_qualification;
                    newUser.local.teacher_grade = teacher_grade;
                    newUser.local.teacher_description = teacher_description;

                    // save the user
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

        app.post('/user/edit', function(req, res) {

            var _id = req.param('id');
            var email = req.param('email');
            var password = req.param('password');
            var firstname = req.param('firstname');
            var lastName = req.param('lastName');
            var phone = req.param('phone');
            var skype = req.param('skype');
            var type = req.param('type');
            var userID = req.param('userID');
            var student_schoolName = req.param('student_schoolName');
            var student_guardianInfo = req.param('student_guardianInfo');
            var student_grade = req.param('student_grade');
            var teacher_availability = req.param('teacher_availability');
            var teacher_qualification = req.param('teacher_qualification');
            var teacher_grade = req.param('teacher_grade');
            var teacher_description = req.param('teacher_description');
            // var teacher_attachments = req.param('teacher_attachments');

            User.findOne({
                _id: _id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                } else if (user) {

                    user.local.email = email;
                    user.local.password = User.generateHash(password);
                    user.local.firstname = firstname;
                    user.local.lastName = lastName;
                    user.local.skype = skype;
                    user.local.type = type;
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
        app.delete('/user/delete/:email', function(req, res) {

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