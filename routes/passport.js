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
		//console.log(req.params);
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

					//set remember cookie
					// if (req.body.remember == "true") {
					// 	req.session.cookie.maxAge = 60000 * 60 * 24 * 30;
					// } else {
					// 	req.session.cookie.expires = false;
					// }

					res.send(user);
				});

				//next(null, user);
			}

		})(req, res, next);
	});

	//check login
	app.get('/check', function(req, res){
		if(req.isAuthenticated()){
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