var _Class = require('../models/class');

module.exports = function(app) {

    /*
     * GET list classes
     */
    app.get('/class/list', function(req, res) {
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
     * GET list classes with pagination
     */
    app.get('/class', function(req, res) {

        var page = req.param('page', 1);
        var perPage = req.param('perpage', 10);
        page = page - 1;

        _Class
            .find()
            //.select('local.email')
            .limit(perPage)
            .skip(Math.ceil(perPage * page))
            // .sort({email: 'asc'})
            .exec(function(err, classes) {
                _Class.count().exec(function(err, count) {
                    // console.log(count);
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({
                            "count": count,
                            "classes": classes
                        });
                    }
                });
            });
    });

    /*
     * GET one class by ID
     */
    app.get('/class/:id', function(req, res) {

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
    app.post('/class', function(req, res) {

        var className = req.param('classname');
        var classCategory = req.param('classCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var classID = req.param('classID');
        var schoolName = req.param('schoolName');
        var starttime = req.param('starttime');
        var endtime = req.param('endtime');
        var startingTime = req.param('startingTime');
        var endingTime = req.param('endingTime');

        _Class.findOne({
            className: className
        }, function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_class) {
                res.send({
                    "err": 'That class name is already taken.'
                });
            } else {
                var newClass = new _Class();

                newClass.className = className;
                newClass.classCategory = classCategory;
                newClass.description = description;
                newClass.packageName = packageName;
                newClass.classID = classID;
                newClass.schoolName = schoolName;
                newClass.starttime = starttime;
                newClass.endtime = endtime;
                newClass.startingTime = startingTime;
                newClass.endingTime = endingTime;

                // save the user
                newClass.save(function(err) {
                    if (err) {
                        res.send({
                            "err": err
                        });
                    } else {
                        res.send({
                            "res": 'Class added!'
                        });
                    }
                });
            }
        });
    });

    /*
     * PUT to edit.
     */
    app.put('/class', function(req, res) {

        // var _class = req.param('class');
        var _id = req.param('_id');
        var className = req.param('className');
        var classCategory = req.param('classCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var classID = req.param('classID');
        var schoolName = req.param('schoolName');
        var starttime = req.param('starttime');
        var endtime = req.param('endtime');
        var startingTime = req.param('startingTime');
        var endingTime = req.param('endingTime');

        _Class.findOne({
            _id: _id
        }, function(err, _class) {
            // if there are any errors, return the error
            if (err) {
                res.send({
                    "err": err
                });
            } else if (_class) {

                _class.className = className;
                _class.classCategory = classCategory;
                _class.description = description;
                _class.packageName = packageName;
                _class.classID = classID;
                _class.schoolName = schoolName;
                _class.starttime = starttime;
                _class.endtime = endtime;
                _class.startingTime = startingTime;
                _class.endingTime = endingTime;

                // save the user
                _class.save(function(err) {
                    if (err) {
                        res.send({
                            "err": err
                        });
                    } else {
                        res.send({
                            "res": 'Class Updated!'
                        });
                    }
                });
            }
        });
    });

    /*
     * DELETE to deleteuser.
     */
    app.delete('/class/:id', function(req, res) {

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