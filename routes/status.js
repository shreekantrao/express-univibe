var express = require('express');
var router = express.Router();

var status = require('../controllers/status');
 
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect(301, '/status/list');
});
router.get('/list', function (req, res, next) {
    let notify = '';
    if (req.session.notify) {
        notify = req.session.notify;
        delete req.session.notify;
    }
    res.render('page', { "page_Code": "status", "page_Title": "College User Status", "notify": notify });
});

// --- City ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
    status.getStatusList(req, res, next);
});

// --- City ajax pages --- //
router.post('/changestate', function (req, res, next) {
    status.changeState(req, res, next);
});

// --- Delete Status --- //
router.post('/delete', function (req, res, next) {
    status.deleteStatus(req, res, next);
});
module.exports = router;