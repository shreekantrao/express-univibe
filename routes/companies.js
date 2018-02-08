var express = require('express');
var router = express.Router();

var companies = require('../controllers/companies');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/companies/list');
});

// --- Company template call --- //
router.get('/list', function(req, res, next) {
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"companies","page_Title":"Company Companies","notify":notify});
});

// --- Company ajax pages --- //
router.get('/page/:page_no', function(req, res, next) {
	companies.getCompanyList(req, res, next);
});

// --- Company name check --- //
router.post('/checkcompanyname', function(req, res, next) {
	companies.checkCompanyNameExists(req, res, next);
});

// --- Company add action--- //
router.post('/addcompany', function (req, res, next) {
	companies.createNewCompany(req, res, next);
});

// --- Company edit action --- //
router.post('/updatecompany', function(req, res, next) {
	companies.updateCompany(req, res, next);
});

// --- Company delete action --- //
router.post('/deletecompany', function (req, res, next) {
	companies.deleteCompany(req, res, next);
});

module.exports = router;
