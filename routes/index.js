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
	res.locals.isAdmin = req.session.isAdmin;

	if (req.isAuthenticated()) {

		res.locals.logged = 1;

		//getClassRegs(req.user._id, function(docs){
			//console.log(docs);
		//});
		

		res.render('index', {
			title: 'Home',
			heading: 'Main page',
			user: req.user,
			// docs: docs
		});

	} else {
		res.render('index', {
			title: 'Home',
			heading: 'Main page'
		});
	}

});


/* get Class reg info for main page */
function getClassRegs(userID, cb){

	var _Class = require('../models/class');
	var User = require('../models/user');
	var ClassReg = require('../models/classRegistration');

	User.findOne({
			'_id': userID
		}, function(err, user) {
			if (err) {
				res.send('User not Found');
			} else {
				if (user.local.userType == 'teacher') {
					ClassReg.find({
						'teachers': {
							$in: [
								userID
							]
						}
					}, function(err, docs) {
						if (err) {
							// res.send(err);
							// return err;
							cb(err);
						} else if (docs) {

							// //make array of ids
							var class_ids = [];
							docs.forEach(function(item){
								class_ids.push(item.class_id);
							});

							// //find all the class details
							_Class.find({
								'_id': {
									$in: class_ids
								}
							}, function(err, docs) {
								if (err) {
									// res.send(err);
									// return err;
									cb(err);
								} else {
									// res.send(docs);
									// return docs;									
									cb(docs);
								}
							});
						} else {
							// res.send('[]');
							cb('[]');
						}
					});
				} else if (user.local.userType == 'student') {

					console.log(userID);
					//get student classes regs
					ClassReg.find({
						'students': {
							$in: [
								userID
							]
						}
					}, function(err, docs) {
						console.log(err);
						if (err) {
							// res.send(err);
							// return err;
							cb(err);
						} else if (docs) {
								// console.log('st');
								console.log(docs);
							// //make array of ids
							var class_ids = [];
							docs.forEach(function(item){
								class_ids.push(item.class_id);
							});

							// //find all the class details
							_Class.find({
								'_id': {
									$in: class_ids
								}
							}, function(err, docs) {
								if (err) {
									// res.send(err);
									// return err;
									cb(err);
								} else {
									//res.send(docs);
									// return docs;
									cb(docs);
								}
							});
						} else {
							// res.send('[]');
							// return '[]';
							cb('[]');
						}
					});
				}
			}
		});
}

/* GET Admin page */
router.get('/admin', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.logged = 1;
		res.locals.isAdmin = req.session.isAdmin;
		res.render('adminpanel', {
			title: 'Admin',
			heading: 'Admin actions',
			user: req.user
		});
	} else {
		res.redirect('/');
	}
});

// Admin Evaluators Page
router.get('/manageEvaluators', function(req, res){
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.logged = 1;
		res.locals.isAdmin = req.session.isAdmin;
		res.render('manageevaluators', {
			title: 'Manage Evaluators',
			heading: '',
			user: req.user
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin create class */
router.get('/createcourse', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.logged = 1;
		res.locals.isAdmin = req.session.isAdmin;

		var common = require("../config/common");

		res.render('createcourse', {
			title: 'Admin Create Course',
			heading: '',
			user: req.user,
			common: common
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin edit class */
router.get('/editcourse', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {

		var common = require("../config/common");

		res.locals.logged = 1;
		res.locals.isAdmin = req.session.isAdmin;
		res.render('editcourses', {
			title: 'Admin Edit Course',
			heading: '',
			user: req.user,
			common: common
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin add edit class */
router.get('/addeditclass', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {

		var common = require("../config/common");

		res.locals.logged = 1;
		res.locals.isAdmin = req.session.isAdmin;
		res.render('addeditclass', {
			title: 'Admin Add/Edit Class',
			heading: '',
			user: req.user,
			common: common
		});
	} else {
		res.redirect('/');
	}
});

/* GET Admin create class */
router.get('/classreg', function(req, res) {
	if (req.session.isAdmin && req.isAuthenticated()) {
		res.locals.isAdmin = req.session.isAdmin;
		res.locals.logged = 1;
		res.render('classreg', {
			title: 'Class Registration',
			heading: '',
			user: req.user
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

router.get('/classroom/:id', function(req, res) {

	res.locals.class_id = req.param('id');
	res.locals.logged = 0;
	res.locals.isAdmin = req.session.isAdmin;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;
		res.render('classroom', {
			title: 'Class Room',
			heading: 'Class Room page',
			user: req.user
		});
	} else {
		res.redirect('/');
	}

});

/* GET home page. */
router.get('/register', function(req, res) {

	res.locals.logged = 0;
	res.locals.isAdmin = req.session.isAdmin;

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

/* GET home page. */
router.get('/auth', function(req, res) {

	res.locals.logged = 0;
	res.locals.isAdmin = req.session.isAdmin;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;
		res.redirect('/');
	} else {
		res.render('auth', {
			title: 'Auth',
			heading: 'Register and Login'
		});
	}

});

router.get('/editprofile', function(req, res) {

	var User = require('../models/user');

	res.locals.logged = 0;
	res.locals.isAdmin = req.session.isAdmin;

	if (req.isAuthenticated()) {
		res.locals.logged = 1;

		//get logged in user
		User.findOne({
			_id: req.user._id
		}, function(err, user) {
			if (err) {
				res.send(err);
			} else if (user) {

				var filesPath = './public/uploads/'+req.user._id+'/files/';

				//get user files
				var fs = require('fs');
				fs.readdir(filesPath, function(err, data){
					res.render('editprofile', {
						title: 'Edit Profile',
						heading: 'Change Information',
						user: req.user,
						files: data
					});	
				});

				
			}
		});



	} else {
		res.redirect('/');
	}
});


module.exports = router;