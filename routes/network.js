var express = require('express');
var router = express.Router();

var network = require('../controllers/network');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/network/list');
});
router.get('/list/:alphabet?', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	res.render('page', {"page_Code":"network","page_Title":"College Network","alphabet":req.params.alphabet});
});

// --- this is Ajax call with only page no --- //
router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	network.userslist(req, res, next);
});

// --- this is Ajax call with alphabet,--- //
router.get('/page/:page_no/:alphabet', function(req, res, next) {
	// console.log('router userslist');
	network.userslist(req, res, next);
});

// ############################ CSV download #################################

// --- call to download CSV --- //
router.get('/export2csv', function(req, res, next) {
	// console.log('router userslist');
	network.export2CSV(req, res, next);
});

// --- call to import CSV --- //
router.post('/importcsv', function(req, res, next) {
	// console.log('router userslist');
	network.importCSV(req, res, next);
});

// ############################ Profile ######################################

// --- Profile page --- //
router.get('/profile/:slug?', function(req, res) {
	// var data = 
	network.profileData(req, res);
	// console.log("data for slug = "+JSON.stringify(data));
	// res.render('page', {"page_Code":"profile","page_Title":"Profile", "data":data});
});

// --- Add new Profile page --- //
router.get('/add', function(req, res) {
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	res.render('page', {"page_Code":"profile_add","page_Title":"Add New Profile","notify":notify});
	// network.profileAdd(req, res);
});
// --- Add new Profile page --- //
router.post('/add', function(req, res) {
	// res.render('page', {"page_Code":"profile_add","page_Title":"Add New Profile"});
	network.profileAdd(req, res);
});
// --- Ajax call to check email exist --- //
router.post('/checkemailavailable', function(req, res, next) {
	// res.render('page', {"page_Code":"profile_add","page_Title":"Add New Profile"});
	network.checkemailavailable(req, res, next);
});

module.exports = router;