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
            _id: _id
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
     * POST Add User
     */
    app.post('/classRegistration/add', function(req, res) {

        var user = req.param('user');
        var type = req.param('type');
        var class_id = req.param('class_id');
        var classStartTime = req.param('classStartTime');
        var classEndTime = req.param('classEndTime');


        ClassReg.findOne({
            class_id: class_id
        }, function(err, classReg) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (classReg) {

                if (type == "student") {
                    classReg.student.push(user);
                } else if (type == "teacher") {
                    classReg.teacher.push(user);
                }


                classReg.class_id = class_id;
                classReg.classStartTime = classStartTime;
                classReg.classEndTime = classEndTime;

                // save the user
                classReg.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('ClassReg Updated!');
                    }
                });
            } else {
                var newClassReg = new ClassReg();

                if (type == "student") {
                    newClassReg.student.push(user);
                } else if (type == "teacher") {
                    newClassReg.teacher.push(user);
                }


                newClassReg.class_id = class_id;
                newClassReg.classStartTime = classStartTime;
                newClassReg.classEndTime = classEndTime;

                // save the user
                newClass.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('ClassReg Updated!');
                    }
                });
            }
        });
    });


    /*
     * DELETE to delete User from reg.
     */
    app.delete('/classRegistration/deleteuser/:id', function(req, res) {

        var id = req.param('id');

        ClassReg.find({ students: id }, function(err, item){
            if (err) {
                res.send(err);
            } else {
                console.log(item);
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