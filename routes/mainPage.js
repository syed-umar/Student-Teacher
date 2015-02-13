var _Class = require('../models/class');
var User = require('../models/user');
var ClassReg = require('../models/classRegistration');

module.exports = function(app) {

	//get all classes of logged in user
	app.get('/getclassregs/:id', function(req, res) {
		// var userID = req.param('id');
		var userID = req.param('id');

		if (req.isAuthenticated()) {
			//get userType

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
								res.send(err);
							} else if (docs) {

								// //make array of ids
								var class_ids = [];
								docs.forEach(function(item) {
									class_ids.push(item.class_id);
								});

								// //find all the class details
								_Class.find({
									'_id': {
										$in: class_ids
									}
								}, function(err, docs) {
									if (err) {
										res.send(err);
									} else {
										res.send(docs);
									}
								});
							} else {
								res.send('[]');
							}
						});
					} else if (user.local.userType == 'student') {

						//get student classes regs
						ClassReg.find({
							'students': {
								$in: [
									userID
								]
							}
						}, function(err, docs) {
							if (err) {
								res.send(err);
							} else if (docs) {

								// //make array of ids
								var class_ids = [];
								docs.forEach(function(item) {
									class_ids.push(item.class_id);
								});

								// //find all the class details
								_Class.find({
									'_id': {
										$in: class_ids
									}
								}, function(err, docs) {
									if (err) {
										res.send(err);
									} else {
										res.send(docs);
									}
								});
							} else {
								res.send('[]');
							}
						});
					}
				}
			});
		} else {
			res.send('not logged in');
		}
	});
}