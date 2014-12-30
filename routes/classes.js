var express = require('express');
var router = express.Router();
var _Class = require('../models/class');

/* GET users listing. */
router.get('/', function(req, res) {
    res.redirect('/users/userlist');
});

/*
 * GET list classes
 */
router.get('/list', function(req, res) {
    _Class.find(function(err, classes) {
        if (err) {
            res.send(err);
        } else {
            res.json(classes);
        }
    })
});

/*
 * POST to addclass.
 */
router.post('/addclass', function(req, res) {

    var className = req.param('classname');
    var password = req.param('password');

    //res.send(username);

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

            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);


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
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:email', function(req, res) {

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


module.exports = router;