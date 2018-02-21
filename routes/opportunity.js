var express = require('express');
var router = express.Router();

var opportunity = require('../controllers/opportunity');

// --- GET users listing. --- //
router.get('/', function (req, res, next) {
    res.redirect(301, '/opportunity/list');
});

router.get('/list', function (req, res, next) {
    res.render('page', { "page_Code": "opportunity", "page_Title": "College User Opportunity" });
});

// --- Opportunities ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
    opportunity.getOpportunityList(req, res, next);
});

// --- Opportunities change status --- //
router.post('/changestate', function (req, res, next) {
    opportunity.changeState(req, res, next);
});

// --- Delete item --- //
router.post('/delete', function (req, res, next) {
    opportunity.deleteOpportunity(req, res, next);
});

// --- Save item --- //
router.post('/save', function (req, res, next) {
    opportunity.saveOpportunity(req, res, next);
});
module.exports = router;