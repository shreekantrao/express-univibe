var express = require('express');
var router = express.Router();

var event = require('../controllers/event');

// --- GET events listing --- //
router.get('/', function (req, res, next) {
    res.redirect(301, '/event/list');
});

router.get('/list', function (req, res, next) {
    res.render('page', { "page_Code": "event", "page_Title": "College User Event" });
});

// --- Event list page --- //
router.get('/page/:page_no', function (req, res, next) {
    event.getEventList(req, res, next);
});

// --- Change item event --- //
router.post('/changestate', function (req, res, next) {
    event.changeState(req, res, next);
});

// --- Delete item --- //
router.post('/delete', function (req, res, next) {
    event.deleteEvent(req, res, next);
});

// --- Add item --- //
router.post('/save', function (req, res, next) {
    event.saveEvent(req, res, next);
});
module.exports = router;