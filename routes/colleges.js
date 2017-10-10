var express = require('express');
var router = express.Router();

// var colleges = require('../controllers/colleges');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/colleges/list');
});
router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	res.render('page', {"page_Code":"colleges","page_Title":"College Network"});
});

// --- this is Ajax call with only page no --- //
// router.get('/page/:page_no', function(req, res, next) {
// 	// console.log('router userslist');
// 	network.userslist(req, res, next);
// });

// --- this is Ajax call with alphabet,--- //
// router.get('/page/:page_no/:alphabet', function(req, res, next) {
// 	// console.log('router userslist');
// 	network.userslist(req, res, next);
// });

// ############################ Profile ######################################

// --- College detail page --- //
router.get('/:collegename/', function(req, res) {
	//network.profileData(req, res);
	// console.log("data for slug = "+JSON.stringify(data));
	res.render('page', {"page_Code":"college-details","page_Title":"Profile"});
});

// --- College detail page --- //
router.get('/:collegename/edit', function(req, res) {
	//network.profileData(req, res);
	// console.log("data for slug = "+JSON.stringify(data));
	// res.end("hello");
	res.render('page', {"page_Code":"college-edit","page_Title":"Profile"});
});

module.exports = router;