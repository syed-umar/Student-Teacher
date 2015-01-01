var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	res.locals.logged = 0;

	if (req.isAuthenticated()){
		res.locals.logged = 1;
		res.render('index', { title: 'Home', heading: 'Main page', user: req.user });
	} else {
		res.render('index', { title: 'Home', heading: 'Main page', page: 'index.ejs' });
	}
	
});

module.exports = router;
