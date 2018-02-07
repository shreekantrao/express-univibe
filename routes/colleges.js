var express = require('express');
var router = express.Router();

var colleges = require('../controllers/colleges');

// ############################ College list page ######################################

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/colleges/list');
});
router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"colleges","page_Title":"College Network","notify":notify});
});

// ############################ College list page ######################################

router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	colleges.getCollegeList(req, res, next);
});

// ############################ College add ######################################

// --- College add page --- //
router.get('/add', function(req, res) {
	//network.profileData(req, res);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	res.render('page', {"page_Code":"college-add","page_Title":"Add new College","notify":notify});
});

// --- College add acction--- //
router.post('/addnew', function(req, res, next) {
	// console.log("add new college ", req.body);
	colleges.createNewCollege(req, res, next);
	// res.render('page', {"page_Code":"college-add","page_Title":"Add new College"});
});

router.post('/checkcollegename', function(req, res, next) {
	// console.log("data for slug");
	colleges.checkCollegeNameExists(req, res, next);
});

router.post('/checkdomainavailable', function(req, res, next) {
	// console.log("data for slug");
	colleges.checkDomainAvailable(req, res, next);
});
// ############################ College detail ######################################

// --- College detail page --- //
router.get('/details/:collegename/', function(req, res) {
	//network.profileData(req, res);
	// console.log("data for slug = "+JSON.stringify(data));
	res.render('page', {"page_Code":"college-details","page_Title":"Profile"});
});

// ############################ College edit ######################################

// --- College edit page --- //
router.get('/edit/:collegename', function(req, res, next) {
	colleges.getCollegeData(req, res, next);
	// res.render('page', {"page_Code":"college-edit","page_Title":"Profile"});
});

// --- College edit action --- //
router.post('/edit', function(req, res, next) {
	colleges.saveCollegeData(req, res, next);
});

// --- Ajax call to get Batch & Courses --- //
router.post('/getbatchncourses', function (req, res, next) {
	// console.log('router');
	// res.render('page', {"page_Code":"profile_add","page_Title":"Add New Profile"});
	colleges.getBatchNCourses(req, res, next);
});

module.exports = router;
