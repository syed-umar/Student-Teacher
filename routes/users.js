
var User = require('../models/user');

module.exports = function(app) {

        /* GET users listing. */
        app.get('/', function(req, res) {
            res.redirect('/users/userlist');
        });

        /*
         * GET userlist.
         */
        app.get('/userlist', function(req, res) {

            User.find(function(err, users) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(users);
                }
            })
        });

        /*
         * POST to adduser.
         */
        app.post('/adduser', function(req, res) {

            var email = req.param('email');
            var password = req.param('password');

            //res.send(username);

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
         * DELETE to deleteuser.
         */
        app.delete('/deleteuser/:email', function(req, res) {

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