var express = require('express');
var router = express.Router();

// var status = require('../controllers/status');
 
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect(301, '/status/list');
});
router.get('/list', function (req, res, next) {
    // console.log("alphabet = "+req.params.alphabet);
    res.render('page', { "page_Code": "status", "page_Title": "College User Status" });
});

// ############################ Status list page ######################################

router.get('/page/:page_no', function (req, res, next) {
    // console.log('router userslist');
    companies.getStatusList(req, res, next);
});

module.exports = router;