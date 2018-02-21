var express = require('express');
var router = express.Router();

var cities = require('../controllers/cities');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.redirect(301, '/cities/list');
});

// --- City template call --- //
router.get('/list', function (req, res, next) {
	let notify = '';
	if (req.session.notify) {
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', { "page_Code": "cities", "page_Title": "City Cities", "notify": notify });
});

// --- City ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
	cities.getCityList(req, res, next);
});

// --- City name check --- //
router.post('/checkcityname', function (req, res, next) {
	cities.checkCityNameExists(req, res, next);
});

// --- City add action--- //
router.post('/addcity', function (req, res, next) {
	cities.createNewCity(req, res, next);
});

// --- City edit action --- //
router.post('/updatecity', function (req, res, next) {
	cities.updateCity(req, res, next);
});

// --- City delete action --- //
router.post('/deletecity', function (req, res, next) {
	cities.deleteCity(req, res, next);
});

module.exports = router;
