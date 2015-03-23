var _Course = require('../models/course');

module.exports = function(app) {

    /*
     * GET list courses
     */
    app.get('/course/list', function(req, res) {
        _Course.find(function(err, _course) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_course) {
                res.json(_course);
            }
        });
    });

    /*
     * GET list courses with pagination
     */
    app.get('/course', function(req, res) {

        var page = req.param('page', 1);
        var perPage = req.param('perpage', 10);
        page = page - 1;

        _Course
            .find()
            //.select('local.email')
            .limit(perPage)
            .skip(Math.ceil(perPage * page))
            // .sort({email: 'asc'})
            .exec(function(err, courses) {
                _Course.count().exec(function(err, count) {
                    // console.log(count);
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({
                            "count": count,
                            "courses": courses
                        });
                    }
                });
            });
    });

    /*
     * GET one course by ID
     */
    app.get('/course/:id', function(req, res) {

        var _id = req.param('id');

        _Course.findOne({
            _id: _id
        }, function(err, _course) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_course) {
                res.json(_course);
            }
        });
    });

    /*
     * POST to addcourse.
     */
    app.post('/course', function(req, res) {

        var courseName = req.param('coursename');
        var courseCategory = req.param('courseCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var courseID = req.param('courseID');
        var schoolName = req.param('schoolName');
        var numberof = req.param('numberof');

        _Course.findOne({
            courseName: courseName
        }, function(err, _course) {
            // if there are any errors, return the error
            if (err) {
                res.send(err);
            } else if (_course) {
                res.send({
                    "err": 'That course name is already taken.'
                });
            } else {
                var newcourse = new _Course();

                newcourse.courseName = courseName;
                newcourse.courseCategory = courseCategory;
                newcourse.description = description;
                newcourse.packageName = packageName;
                newcourse.courseID = courseID;
                newcourse.schoolName = schoolName;
                newcourse.numberof = numberof;

                // save the user
                newcourse.save(function(err) {
                    if (err) {
                        res.send({
                            "err": err
                        });
                    } else {
                        res.send({
                            "res": 'course added!'
                        });
                    }
                });
            }
        });
    });

    /*
     * PUT to edit.
     */
    app.put('/course', function(req, res) {

        // var _course = req.param('course');
        var _id = req.param('_id');
        var courseName = req.param('courseName');
        var courseCategory = req.param('courseCategory');
        var description = req.param('description');
        var packageName = req.param('packageName');
        var courseID = req.param('courseID');
        var schoolName = req.param('schoolName');
        var numberof = req.param('numberof');
        
        _Course.findOne({
            _id: _id
        }, function(err, _course) {
            // if there are any errors, return the error
            if (err) {
                res.send({
                    "err": err
                });
            } else if (_course) {

                _course.courseName = courseName;
                _course.courseCategory = courseCategory;
                _course.description = description;
                _course.packageName = packageName;
                _course.courseID = courseID;
                _course.schoolName = schoolName;
                _course.numberof = numberof;

                // save the user
                _course.save(function(err) {
                    if (err) {
                        res.send({
                            "err": err
                        });
                    } else {
                        res.send({
                            "res": 'course Updated!'
                        });
                    }
                });
            }
        });
    });

    /*
     * DELETE to deleteuser.
     */
    app.delete('/course/:id', function(req, res) {

        var _id = req.param('id');

        _Course.remove({
            _id: _id
        }, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('course removed!');
            }
        });

    });



};