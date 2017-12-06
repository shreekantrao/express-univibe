var express = require('express');
var router = express.Router();

var status = require('../controllers/status');
 
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect(301, '/status/list');
});
router.get('/list', function (req, res, next) {
    // console.log("alphabet = "+req.params.alphabet);
    // status.getStatusSearch(req, res, next);
    res.render('page', { "page_Code": "status", "page_Title": "College User Status" });
});

// ############################ Status list page ######################################

router.get('/page/:page_no', function (req, res, next) {
    // console.log('router userslist');
    status.getStatusList(req, res, next);
});

// ############################ Change item status ######################################

router.post('/changestate', function (req, res, next) {
    status.changeState(req, res, next);
});

// ############################ Delete item ######################################

router.post('/deletestatus', function (req, res, next) {
    status.deleteStatus(req, res, next);
});
module.exports = router;