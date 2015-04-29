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

						// console.log('rem '+req.body.remember);
						//set remember cookie
						if (req.body.remember) {
							req.session.cookie.maxAge = 6000000 * 60 * 24 * 30;
						} else {
							req.session.cookie.expires = false;
						}

						//check Evaluator
						if(user.local.isEvaluator){
							req.session.isEvaluator = true;
						} else {
							req.session.isEvaluator = false;
						}

						var r = {};

						//check admin
		                var admins = require('../config/admins');
		                admins.emails.forEach(function(admin) {
		                    if(admin == user.local.email){
		                    	req.session.isAdmin = true;
		                    	res.locals.isAdmin = true;
		                    	// res.redirect('/admin');
		                    	
		                    	r.status = 'logged in';
		                    	r.isAdmin = true;
		                    	res.json(r);
		                    } else {
		                    	res.locals.isAdmin = false;
		                    	// res.redirect('/');

		                    	r.status = 'logged in';
		                    	r.isAdmin = false;
		                    	res.json(r);
		                    }
		                });
						
						
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
		req.session.isAdmin = false;
		req.logout();
		res.redirect('/');
	});
}