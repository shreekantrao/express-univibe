var express = require('express');
var router = express.Router();

var industries = require('../controllers/industries');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.redirect(301, '/industries/list');
});

// --- Industry template call --- //
router.get('/list', function (req, res, next) {
	let notify = '';
	if (req.session.notify) {
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', { "page_Code": "industries", "page_Title": "Industry Industries", "notify": notify });
});

// --- Industry ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
	industries.getIndustryList(req, res, next);
});

// --- Industry name check --- //
router.post('/checkindustryname', function (req, res, next) {
	industries.checkIndustryNameExists(req, res, next);
});

// --- Industry add action--- //
router.post('/addindustry', function (req, res, next) {
	industries.createNewIndustry(req, res, next);
});

// --- Industry edit action --- //
router.post('/updateindustry', function (req, res, next) {
	industries.updateIndustry(req, res, next);
});

// --- Industry delete action --- //
router.post('/deleteindustry', function (req, res, next) {
	industries.deleteIndustry(req, res, next);
});

module.exports = router;
