var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	if (req.param('msg')) {
		res.locals.serverMsg = 'msg here';
	} else {
		res.locals.serverMsg = null;
	}

	res.locals.logged = 0;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;
		res.render('index', {
			title: 'Home',
			heading: 'Main page',
			user: req.user
		});
	} else {
		res.render('index', {
			title: 'Home',
			heading: 'Main page',
			page: 'index.ejs'
		});
	}

});

/* GET home page. */
router.get('/register', function(req, res) {

	res.locals.logged = 0;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;
		res.redirect('/');
	} else {
		res.render('signup', {
			title: 'Register',
			heading: 'Registration page',
			page: 'index.ejs'
		});
	}

});

router.get('/editprofile', function(req, res) {

	var User = require('../models/user');

	res.locals.logged = 0;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;

		//get logged in user
		User.findOne({
			_id: req.user._id
		}, function(err, user) {
			if (err) {
				res.send(err);
			} else if (user) {
				res.render('editprofile', {
					title: 'Edit Profile',
					heading: 'Change Information',
					user: req.user
				});
			}
		});



	} else {
		res.redirect('/');
	}
});


module.exports = router;