var express = require('express');
var router = express.Router();

var companies = require('../controllers/companies');

// ############################ Company list page ######################################

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/companies/list');
});

router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"companies","page_Title":"Company Companies","notify":notify});
});

// ############################ Company list page ######################################

router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	companies.getCompanyList(req, res, next);
});

// ############################ Company add ######################################

// --- Company add page --- //
// router.get('/add', function(req, res) {
// 	//network.profileData(req, res);
// 	let notify = '';
// 	if(req.session.notify){
// 		notify = req.session.notify;
// 		delete req.session.notify;
// 	}
// 	res.render('page', {"page_Code":"company-form","page_Title":"Add new Company","notify":notify});
// });

// --- Company add acction--- //
router.post('/addnew', function(req, res, next) {
	companies.createNewCompany(req, res, next);
	
	// console.log("data for slug = "+JSON.stringify(data));
	// res.render('page', {"page_Code":"company-form","page_Title":"Add new Company"});
});

router.post('/checkcompanyname', function(req, res, next) {
	// console.log("data for slug");
	companies.checkCompanyNameExists(req, res, next);
});
// ############################ Company detail ######################################

// --- Company detail page --- //
// router.get('/:companyname/', function(req, res) {
// 	//network.profileData(req, res);
// 	// console.log("data for slug = "+JSON.stringify(data));
// 	res.render('page', {"page_Code":"company-details","page_Title":"Profile"});
// });

// ############################ Company edit ######################################

// --- Company edit page --- //
router.post('/savecompany', function(req, res, next) {
	// console.log("data for slug");
	companies.savecompany(req, res, next);
});

// --- Company edit action --- //
// router.post('/edit', function(req, res, next) {
// 	companies.saveCompanyData(req, res, next);
// });
module.exports = router;
