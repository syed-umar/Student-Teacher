var ClassSession = require('../models/classSession');

module.exports = function(app) {
    app.get('/getClassSessions/:classid', function(req, res) {

        var page = req.param('page', 1);
        var classID = req.param('classid');
        var perPage = req.param('perpage', 5);
        page = page - 1;

        ClassSession
            .find({
                classID: classID
            })
            //.select('local.email')
            .limit(perPage)
            .skip(Math.ceil(perPage * page))
            // .sort({email: 'asc'})
            .exec(function(err, sessions) {
                ClassSession.count({
                    classID: classID
                }).exec(function(err, count) {
                    // console.log(count);
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({
                            "count": count,
                            "sessions": sessions
                        });
                    }
                });
            });
    });

    app.post('/addSession', function(req, res) {
        var newSession_data = req.param('newSession');
        // console.log(newSession_data);

        var newSession = new ClassSession();

        newSession.classID = newSession_data.classID;
        newSession.sessionID = newSession_data.sessionID;
        newSession.sessionDate = newSession_data.sessionDate;
        newSession.startTime = newSession_data.startTime;
        newSession.duration = newSession_data.duration;
        newSession.comments = newSession_data.comments;
        newSession.notification = newSession_data.notification;

        newSession.save(function(err, session) {
            if (err) {
                res.send('err: ' + err);
            } else {
                res.send('added');
            }
        });

    });

    app.post('/updateSession', function(req, res) {
        var session_data = req.param('Session');
        // console.log(newSession_data);

        // var newSession = new ClassSession();

        ClassSession.findOne({
            _id: session_data._id
        }, function(err, session) {
            if (err) {
                res.send(err);
            } else {
                session.classID = session_data.classID;
                session.sessionID = session_data.sessionID;
                session.sessionDate = session_data.sessionDate;
                session.startTime = session_data.startTime;
                session.duration = session_data.duration;
                session.comments = session_data.comments;
                session.notification = session_data.notification;

                session.save(function(err, session) {
                    if (err) {
                        res.send('err: ' + err);
                    } else {
                        res.send('updated');
                    }
                });
            }
        });


    });

    // get sessions in a class
    app.get('/getSessionsInClass/:id', function(req, res) {

        var id = req.param('id');

        ClassSession.find({
            classID: id
        }, function(err, sessions) {
            if (err) {
                res.send(err);
            } else if (sessions) {
                res.json({
                    status: "ok",
                    data: sessions
                });
            } else {
                res.send('[]');
            }
        });
    });

}
