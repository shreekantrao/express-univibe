var express = require('express');
var router = express.Router();

var industries = require('../controllers/industries');

// ############################ Industry list page ######################################

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/industries/list');
});

router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"industries","page_Title":"Industry Industries","notify":notify});
});

// ############################ Industry list page ######################################

router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	industries.getIndustryList(req, res, next);
});

// ############################ Industry add ######################################

// --- Industry add page --- //
// router.get('/add', function(req, res) {
// 	//network.profileData(req, res);
// 	let notify = '';
// 	if(req.session.notify){
// 		notify = req.session.notify;
// 		delete req.session.notify;
// 	}
// 	res.render('page', {"page_Code":"industry-form","page_Title":"Add new Industry","notify":notify});
// });

// --- Industry add acction--- //
router.post('/addnew', function(req, res, next) {
	industries.createNewIndustry(req, res, next);
	
	// console.log("data for slug = "+JSON.stringify(data));
	// res.render('page', {"page_Code":"industry-form","page_Title":"Add new Industry"});
});

router.post('/checkindustryname', function(req, res, next) {
	// console.log("data for slug");
	industries.checkIndustryNameExists(req, res, next);
});
// ############################ Industry detail ######################################

// --- Industry detail page --- //
// router.get('/:industryname/', function(req, res) {
// 	//network.profileData(req, res);
// 	// console.log("data for slug = "+JSON.stringify(data));
// 	res.render('page', {"page_Code":"industry-details","page_Title":"Profile"});
// });

// ############################ Industry edit ######################################

// --- Industry edit page --- //
router.post('/saveindustry', function(req, res, next) {
	// console.log("data for slug");
	industries.saveindustry(req, res, next);
});

// --- Industry edit action --- //
// router.post('/edit', function(req, res, next) {
// 	industries.saveIndustryData(req, res, next);
// });
module.exports = router;
