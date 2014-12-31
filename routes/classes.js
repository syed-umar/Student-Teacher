var _Class = require('../models/class');

module.exports = function(app) {

    /* GET users listing. */
    app.get('/', function(req, res) {
        res.redirect('/users/userlist');
    });

    /*
     * GET list classes
     */
    app.get('/api/classes', function(req, res) {
        _Class.find(function(err, classes) {
            if (err) {
                res.send(err);
            } else {
                res.json(classes);
            }
        })
    });

    /*
     * GET one class by ID
     */
    app.get('/api/classes/:id', function(req, res) {

        var _id = req.param('id');

        _Class.findOne({
            _id: _id
        }, function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_class) {
                res.json(_class);
            }
        });
    });

    /*
     * POST to addclass.
     */
    app.post('/api/classes', function(req, res) {

        var className = req.param('classname');
        var classCategory = req.param('classCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var classID = req.param('classID');
        var schoolName = req.param('schoolName');

        _Class.findOne({
            className: className
        }, function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_class) {
                res.send('That class name is already taken.');
            } else {
                var newClass = new _Class();

                newClass.className = className;
                newClass.classCategory = classCategory;
                newClass.description = description;
                newClass.packageName = packageName;
                newClass.classID = classID;
                newClass.schoolName = schoolName;

                // save the user
                newClass.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('Class added!');
                    }
                });
            }
        });
    });

    /*
     * POST to edit.
     */
    app.put('/api/classes', function(req, res) {

        var _id = req.param('id');
        var className = req.param('classname');
        var classCategory = req.param('classCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var classID = req.param('classID');
        var schoolName = req.param('schoolName');

        _Class.findOne({
            _id: _id
        }, function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_class) {

                _class.className = className;
                _class.classCategory = classCategory;
                _class.description = description;
                _class.packageName = packageName;
                _class.classID = classID;
                _class.schoolName = schoolName;

                // save the user
                _class.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('Class updated!');
                    }
                });
            }
        });
    });

    /*
     * DELETE to deleteuser.
     */
    app.delete('/api/classes/:id', function(req, res) {

        var _id = req.param('id');

        _Class.remove({
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