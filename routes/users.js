var User = require('../models/user');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


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
         * Get users with Pagination
         */
        app.get('/getUsers', function(req, res) {
            var page = req.param('page', 1);
            var perPage = req.param('perpage', 5);
            page = page - 1;

            User
                .find()
                // .sort({regDate: -1})
                //.select('local.email')
                .limit(perPage)
                .skip(Math.ceil(perPage * page))
                // .sort({email: 'asc'})
                // .sort({regDate: 'asc'})
                // .sort({regDate: 1})
                // .sort('regDate', -1)
                .exec(function(err, users) {
                    User.count().exec(function(err, count) {
                        // console.log(count);

                        //sort 
                        users.sort(function(a,b){
                          // Turn your strings into dates, and then subtract them
                          // to get a value that is either negative, positive, or zero.
                          return b.local.regDate - a.local.regDate;
                        });


                        if (err) {
                            res.json({
                                status: "error",
                                err: err
                            });
                        } else {
                            res.json({
                                "count": count,
                                "users": users,
                                "status": 'ok'
                            });
                        }
                    });
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

        // Get user by Email
        app.get('/getUserByEmail/:email', function(req, res) {
            var email = req.param('email');

            User.findOne({
                'local.email': email
            }, function(err, user) {
                if (err) {
                    res.json({
                        status: 'err',
                        data: err
                    });
                } else if (user) {
                    res.json({
                        status: 'ok',
                        data: user
                    });
                } else {
                    res.send('[]');
                }
            })
        });

        /*
         * GET all students
         */
        app.get('/user/list/students', function(req, res) {

            User.find({
                "local.userType": "student"
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
         * GET all teachers
         */
        app.get('/user/list/teachers', function(req, res) {

            User.find({
                "local.userType": "teacher"
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
            var usertype = 'student'; //req.param('type', null);
            var userID = req.param('userID', null);
            var weChatID = req.param('weChatID', null);
            var QQID = req.param('QQID', null);
            var zipCode = req.param('zipCode', null);
            var comments = req.param('comments', null);
            var student_schoolName = req.param('student_schoolName', null);
            var student_guardianInfo = req.param('student_guardianInfo', null);
            var student_grade = req.param('student_grade', null);
            var teacher_availability = req.param('teacher_availability', null);
            var teacher_qualification = req.param('teacher_qualification', null);
            var teacher_grade = req.param('teacher_grade', null);
            var teacher_description = req.param('teacher_description', null);
            var prefered_lang = req.param('prefered_lang', null);
            //var teacher_attachments = req.param('teacher_attachments', null);

            User.findOne({
                'local.email': email
            }, function(err, user) {
                // if there are any errors, return the error

                if (err) {
                    res.send(err);
                } else if (user) {
                    res.json({
                        res: "Email is already taken"
                    });
                } else {
                    User.findOne({
                        'local.userID': userID
                    }, function(err, user) {
                        // if there are any errors, return the error

                        if (err) {
                            res.send(err);
                        } else if (user) {
                            res.json({
                                res: "User Name already taken"
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
                            newUser.local.weChatID = weChatID;
                            newUser.local.QQID = QQID;
                            newUser.local.zipCode = zipCode;
                            newUser.local.comments = comments;
                            newUser.local.student_schoolName = student_schoolName;
                            newUser.local.student_guardianInfo = student_guardianInfo;
                            newUser.local.student_grade = student_grade;
                            newUser.local.teacher_availability = teacher_availability;
                            newUser.local.teacher_qualification = teacher_qualification;
                            newUser.local.teacher_qualification = teacher_qualification;
                            newUser.local.teacher_grade = teacher_grade;
                            newUser.local.teacher_description = teacher_description;
                            newUser.local.prefered_lang = prefered_lang;


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


                }
            });
        });


        /*
         * Update user.
         */

        app.put('/user', function(req, res) {


            var _id = req.param('id');
            var email = req.param('email', null);
            // var password = req.param('password', null);
            var firstName = req.param('firstName', null);
            var lastName = req.param('lastName', null);
            var phone = req.param('phone', null);
            var skype = req.param('skype', null);
            var prefered_lang = req.param('prefered_lang', null);
            var userType = req.param('userType', null);
            var userID = req.param('userID', null);
            var weChatID = req.param('weChatID', null);
            var QQID = req.param('QQID', null);
            var zipCode = req.param('zipCode', null);
            var comments = req.param('comments', null);
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
                    if (prefered_lang != null) {
                        user.local.prefered_lang = prefered_lang;
                    }
                    if (student_schoolName != null) {
                        user.local.student_schoolName = student_schoolName;
                    }
                    if (userType != null) {
                        user.local.userType = userType;
                    }
                    if (userID != null) {
                        user.local.userID = userID;
                    }
                    if (weChatID != null) {
                        user.local.weChatID = weChatID;
                    }
                    if (QQID != null) {
                        user.local.QQID = QQID;
                    }
                    if (zipCode != null) {
                        user.local.zipCode = zipCode;
                    }
                    if (comments != null) {
                        user.local.comments = comments;
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
         * Admin Change Password
         */
        app.put('/adminchangepassword', function(req, res) {
            if (req.isAuthenticated()) {

                var _id = req.param('id');
                var newpassword = req.param('password');
                // var oldpassword = req.param('oldpassword');

                User.findOne({
                    _id: _id
                }, function(err, user) {
                    if (err) {
                        res.send(err);
                    } else if (user) {
                        if (res.locals.isAdmin) {

                            var bcrypt = require('bcrypt-nodejs');

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
                                "res": "Only Admin can Update"
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
         * Upload file
         */
        app.post('/user/uploadpic/:userID', multipartMiddleware, function(req, res) {
            var file = req.files.file;
            var fs = require('fs');
            var userID = req.param('userID');
            // var savePath = './public/uploads/' + req.user._id + '/files/';
            var savePath = './public/uploads/' + userID + '/files/';

            //check type
            if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/gif') {
                //check size - 2mb
                if (file.size <= 2000000) {
                    var fs = require('fs');

                    //create save path
                    if (!fs.exists(savePath)) {
                        var mkdirp = require('mkdirp');

                        mkdirp(savePath, function(err) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('created');
                            }

                        });
                    };

                    fs.readFile(file.path, function(err, data) {
                        if (err) {
                            res.send(err);
                        } else {

                            //set extention
                            var ext = '';
                            if (file.type == 'image/png') {
                                ext = ".png";
                            };
                            if (file.type == 'image/jpg') {
                                ext = ".jpg";
                            };
                            if (file.type == 'image/jpeg') {
                                ext = ".jpeg";
                            };
                            if (file.type == 'image/gif') {
                                ext = ".gif";
                            };

                            fs.writeFile(savePath + 'profile', data, function(err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send('Saved pic');
                                }
                            });
                        }

                    });
                } else {
                    res.send('Size must be less the 2 MB');
                }
            } else if (file.type == 'application/pdf' || file.type == 'application/msword' || file.type == 'application/vnd.oasis.opendocument.text' || file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                //check size - 5mb
                if (file.size <= 5000000) {
                    var fs = require('fs');

                    //create save path
                    if (!fs.exists(savePath)) {
                        var mkdirp = require('mkdirp');

                        mkdirp(savePath, function(err) {
                            if (err) console.log(err);

                        });
                    };

                    fs.readFile(file.path, function(err, data) {
                        if (err) {
                            res.send(err);
                        } else {

                            //set extention 
                            var ext = '';
                            if (file.type == 'application/pdf') {
                                ext = ".pdf";
                            };
                            if (file.type == 'application/msword') {
                                ext = ".doc";
                            };
                            if (file.type == 'application/vnd.oasis.opendocument.text') {
                                ext = ".odt";
                            };

                            //file name
                            // var uuid = require('node-uuid');

                            //fs.writeFile(savePath + uuid.v1() + ext, data, function(err) {
                            fs.writeFile(savePath + file.name, data, function(err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send('Saved file');
                                }
                            });
                        }

                    });
                } else {
                    res.send('Size must be less the 5 MB');
                }
            } else {
                res.send('Wrong format!');
            }

            //res.end();
        });

        // Record audio
        app.get('/recordAudio', function(req, res) {
            res.locals.logged = 0;
            res.locals.isAdmin = req.session.isAdmin;

            if (req.isAuthenticated()) {

                res.locals.logged = 1;

                res.render('record', {
                    title: 'Record',
                    heading: 'Record and Save Audio Clips',
                    user: req.user
                });

            } else {
                res.render('index', {
                    title: 'Home',
                    heading: 'Main page'
                });
            }
        });

        // Useer Audio Page
        app.get('/myAudios', function(req, res) {
            res.locals.logged = 0;
            res.locals.isAdmin = req.session.isAdmin;

            if (req.isAuthenticated()) {

                res.locals.logged = 1;

                // get audio Files
                var AudioFile = require('../models/audioFile');

                AudioFile.find({
                    student_id: req.user._id
                }, function(err, results) {
                    if (err) {
                        res.send(err);
                    } else {
                        // res.send(results);
                        res.render('myaudios', {
                            title: 'My Audio Clips',
                            heading: 'Recorded Audio Clips',
                            user: req.user,
                            audioFiles: results
                        });
                    }
                });

            } else {
                res.render('index', {
                    title: 'Home',
                    heading: 'Main page'
                });
            }
        });

        // Save and transfer Audio
        app.post('/uploadwav', multipartMiddleware, function(req, res) {

            if (req.isAuthenticated()) {
                // console.log(req.files); res.end();
                var file = req.files.blob;
                var fs = require('fs');
                var savePath = './public/uploads/' + req.user._id + '/files/';

                //create save path
                if (!fs.exists(savePath)) {
                    var mkdirp = require('mkdirp');

                    mkdirp(savePath, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('created');
                        }

                    });
                };

                fs.readFile(file.path, function(err, data) {
                    if (err) {
                        res.send(err);
                    } else {

                        // generate filename
                        var uuid = require('node-uuid');
                        var fileName = uuid.v4() + '.wav';

                        fs.writeFile(savePath + fileName, data, function(err) {
                            if (err) {
                                res.send(err);
                            } else {

                                // save in DB
                                var AudioFile = require('../models/audioFile');

                                var audio = new AudioFile();
                                audio.student_id = req.user._id;
                                audio.audioFile = fileName;
                                audio.score = "Not scored yet";
                                audio.status = "New";
                                audio.added = new Date();

                                audio.save(function(err) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        res.send('saved');
                                    }
                                });
                            }
                        });
                    }

                });
            } else {
                res.send('not logged in');
            }
        });

        /*
         * GET list audios with pagination
         */
        app.get('/audioclips', function(req, res) {

            var page = req.param('page', 1);
            var perPage = req.param('perpage', 2);
            page = page - 1;

            var AudioFile = require('../models/audioFile');

            AudioFile
                .find({
                    student_id: req.user._id
                })
                //.select('local.email')
                .limit(perPage)
                .skip(Math.ceil(perPage * page))
                // .sort({email: 'asc'})
                .exec(function(err, clips) {
                    AudioFile.count().exec(function(err, count) {
                        // console.log(count);
                        if (err) {
                            res.send(err);
                        } else {
                            res.json({
                                "count": count,
                                "clips": clips
                            });
                        }
                    });
                });
        });

        // Delete clip
        app.get('/deleteClip/:id', function(req, res) {
            var id = req.param('id');

            var AudioFile = require('../models/audioFile');

            AudioFile.findOne({
                _id: id
            }, function(err, clip) {
                if (err) {
                    res.send(err);
                } else {
                    if (clip.student_id == req.user._id) { //check user

                        //check file status
                        if (clip.status == "In evaluation" || clip.status == "Scored") {
                            res.send('You cannot delete In evaluation or Scored clips');
                        } else {
                            var fs = require('fs');

                            var file = './public/uploads/' + req.user._id + '/files/' + clip.audioFile;

                            fs.unlink(file, function(err) {
                                if (err) {
                                    res.send(err);
                                } else {

                                    //delete from db
                                    AudioFile.remove({
                                        _id: clip._id
                                    }, function() {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            res.send('deleted');
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        res.send('File doesn\'t belongs to logged in user');
                    }
                }
            });
        });

        // make teacher evaluator
        app.get('/makeEvaluator/:id', function(req, res) {
            var id = req.param('id');

            User.findOne({
                _id: id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                } else {
                    user.local.isEvaluator = "true";

                    user.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('added');
                        }
                    });
                }
            });
        });

        // remove teacher evaluator
        app.get('/removeEvaluator/:id', function(req, res) {
            var id = req.param('id');

            User.findOne({
                _id: id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                } else {
                    user.local.isEvaluator = "false";

                    user.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('removed');
                        }
                    });
                }
            });
        });

        // get all evaluators
        app.get('/getEvaluators', function(req, res) {
            User.find({
                'local.isEvaluator': 'true'
            }, function(err, users) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(users);
                }
            });
        });

        // score clip page
        app.get('/scoreClips', function(req, res) {
            if (req.isAuthenticated()) {
                res.locals.logged = 1;
                res.locals.isAdmin = req.session.isAdmin;
                res.render('scoreclips', {
                    title: 'Score Clips',
                    heading: 'Score Audio Clips',
                    user: req.user
                });
            } else {
                res.redirect('/');
            }
        });

        app.get('/getAllClips', function(req, res) {
            var page = req.param('page', 1);
            var perPage = req.param('perpage', 3);
            var sort = req.param('sort', 'New');
            page = page - 1;

            var AudioFile = require('../models/audioFile');

            AudioFile
                .find({
                    status: sort
                })
                //.select('local.email')
                .limit(perPage)
                .skip(Math.ceil(perPage * page))
                .sort({
                    added: 'asc'
                })
                .exec(function(err, clips) {
                    AudioFile.count({
                        status: sort
                    }).exec(function(err, count) {
                        // console.log(count);
                        if (err) {
                            res.send(err);
                        } else {

                            res.json({
                                "count": count,
                                "clips": clips
                            });

                        }
                    });
                });
        });

        app.post('/updateScore', function(req, res) {
            var id = req.param('id');
            var score = req.param('score');

            var AudioFile = require('../models/audioFile');

            AudioFile.findOne({
                _id: id
            }, function(err, clip) {
                if (err) {
                    res.send(err);
                } else {
                    if (score.pronunciation) {
                        clip.pronunciation = score.pronunciation;
                    }

                    if (score.accent) {
                        clip.accent = score.accent;
                    }

                    if (score.vocabulary) {
                        clip.vocabulary = score.vocabulary;
                    }

                    if (score.expression) {
                        clip.expression = score.expression;
                    }

                    if (score.pace) {
                        clip.pace = score.pace;
                    }

                    if (score.finalScore) {
                        clip.finalScore = score.finalScore;
                    }

                    clip.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('upated');
                        }
                    });
                }
            });
        });

        app.get('/updateStatus/:id/:status', function(req, res) {
            var id = req.param('id');
            var status = req.param('status');

            var AudioFile = require('../models/audioFile');

            AudioFile.findOne({
                _id: id
            }, function(err, clip) {
                if (err) {
                    res.send(err);
                } else {
                    clip.status = status;

                    clip.save(function(err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send('upated');
                        }
                    });
                }
            });
        });

        app.get('/editusertype', function(req, res) {
            if (req.session.isAdmin && req.isAuthenticated()) {
                res.locals.logged = 1;
                res.locals.isAdmin = req.session.isAdmin;
                res.render('editusertype', {
                    title: 'Admin',
                    heading: 'Edit User Type',
                    user: req.user
                });
            } else {
                res.redirect('/');
            }
        });

        app.post('/deleteUsers', function(req, res) {
            var postData = req.body.deleteIDs;

            var deleteUsers = [];

            var async = require('async');
            async.series([
                    function(callback) {
                        for (var p in postData) {
                            if (postData[p]) {
                                deleteUsers.push(p);
                            }
                        }
                        callback(null, deleteUsers);
                    },
                    function(callback) {

                        User.remove({
                            _id: {
                                $in: deleteUsers
                            }
                        }, function(err) {
                            if (err) {
                                console.log(err);
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                        // callback(null);
                    }
                ],
                // optional callback 
                function(err, results) {
                    if (err) {
                        res.json({
                            status: "error",
                            err: err
                        });
                    } else {
                        res.json({
                            status: "ok"
                        });
                    }
                });

        });

        /*
         * DELETE to deleteuser.
         */
        app.delete('/user/:id', function(req, res) {

            var id = req.param('id');

            if (req.isAuthenticated() && req.session.isAdmin) {
                User.remove({
                    _id: id
                }, function(err) {
                    if (err) {
                        res.send({
                            status: 'error',
                            err: err
                        });
                    } else {
                        res.send({
                            status: 'ok'
                        });
                    }
                });
            } else {
                res.send('not logged in or not an admin');
            }

        });

    }
    // module.exports = router;
