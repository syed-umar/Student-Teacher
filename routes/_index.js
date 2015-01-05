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
			heading: 'Main page'
		});
	}

});

/* GET Admin page */
router.get('/admin', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.logged = 1;
		res.render('adminpanel', {
			title: 'Admin',
			heading: 'Admin actions',
			user: req.user
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin create class */
router.get('/createclass', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.logged = 1;
		res.render('createclass', {
			title: 'Admin Create Class',
			heading: '',
			user: req.user
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin edit class */
router.get('/editclasses', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {

		var _Class = require('../models/class');

		_Class.find(function(err, classes) {
			if (err) {
				res.send(err);
			} else {
				var totalClasses = classes.length, //get length
					pageSize = 3,
					pageCount = totalClasses / pageSize,
					currentPage = 1,
					//classes = [], //get classes
					classesArrays = [],
					classesList = [];

					pageCount = Math.ceil(pageCount); 
					//console.log(pageCount);


				//split list into groups
				while (classes.length > 0) {
					classesArrays.push(classes.splice(0, pageSize));
				}

				//set current page if specifed as get variable (eg: /?page=2)
				if (typeof req.query.page !== 'undefined') {

					currentPage = +req.query.page;	
					//console.log(req.query.page);

					// if(req.query.page > pageCount){
					// 	currentPage = +parseInt(pageCount);
					// } else 
					// if(req.query.page <= 0){
					// 	currentPage = 1;
					// } else {
						
					// }
					
				}

				//show list of students from group
				classesList = classesArrays[+currentPage - 1];
				


				res.locals.logged = 1;
				res.render('editclasses', {
					title: 'Admin Edit Classes',
					heading: '',
					user: req.user,
					classes: classesList,
					pageSize: pageSize,
					totalClasses: totalClasses,
					pageCount: pageCount,
					currentPage: currentPage
				});
			}
		});



	} else {
		res.redirect('/');
	}
});

// router.get('/editclass/:classid', function(req, res){
// 	if(req.session.isAdmin && req.isAuthenticated()){

// 		//get class 
// 		var class_id = req.param('classid');

// 		res.locals.logged = 1;
// 		res.render('editclass', {
// 			title: 'Admin Edit Class',
// 			heading: '',
// 			user: req.user,
// 			class_id: class_id
// 		});
// 	} else {
// 		res.redirect('/');
// 	}
// });

/* GET home page. */
router.get('/register', function(req, res) {

	res.locals.logged = 0;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;
		res.redirect('/');
	} else {
		res.render('signup', {
			title: 'Register',
			heading: 'Registration page'
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