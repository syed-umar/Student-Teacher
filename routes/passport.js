module.exports = function(app, passport) {
	//add new user
	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', {
			session: false
		}, function(err, user, info) {
			//if (err) { return next(err); }
			if (err) {
				res.send({
					error: err
				});
			} else {

				res.send('Registered!');

			}

		})(req, res, next);
	});

	//login
	app.post('/login', function(req, res, next) {

		var email = req.param('email');
		var password = req.param('password');
		var err_summary = '';
		//validate
		if (!email) {
			err_summary += 'Email is required<br>';
		}

		if (!password) {
			err_summary += 'Password is required<br>';
		}

		if (err_summary == '') {
			passport.authenticate('local-login', function(err, user, info) {
				//if (err) { return next(err); }
				if (err) {
					res.send({
						error: err
					});
				} else {

					req.login(user, function(err) {
						if (err) {
							return next(err);
						}

						//console.log(req.body.remember);

						//set remember cookie
						if (req.body.remember == "on") {
							req.session.cookie.maxAge = 6000000 * 60 * 24 * 30;
						} else {
							req.session.cookie.expires = false;
						}

						//res.send(user);
						//console.log(req.user);
						//res.end();
						res.redirect('/');
					});

					//next(null, user);
				}

			})(req, res, next);
		} else {
			res.send(err_summary);
		}



	});

	//check login
	app.get('/check', function(req, res) {
		if (req.isAuthenticated()) {
			res.send('in');
		} else {
			res.send('out');
		}
	});

	//logout
	app.get('/logout', function(req, res) {

		// clear the remember me cookie when logging out
		res.clearCookie('connect.sid');
		req.logout();
		res.redirect('/');
	});
}