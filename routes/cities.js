var express = require('express');
var router = express.Router();

var cities = require('../controllers/cities');

// ############################ City list page ######################################

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/cities/list');
});

router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"cities","page_Title":"City City","notify":notify});
});

// ############################ City list page ######################################

router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	cities.getCityList(req, res, next);
});

// ############################ City add ######################################

// --- City add page --- //
// router.get('/add', function(req, res) {
// 	//network.profileData(req, res);
// 	let notify = '';
// 	if(req.session.notify){
// 		notify = req.session.notify;
// 		delete req.session.notify;
// 	}
// 	res.render('page', {"page_Code":"city-form","page_Title":"Add new City","notify":notify});
// });

// --- City add acction--- //
router.post('/addnew', function(req, res, next) {
	cities.createNewCity(req, res, next);
	
	// console.log("data for slug = "+JSON.stringify(data));
	// res.render('page', {"page_Code":"city-form","page_Title":"Add new City"});
});

router.post('/checkcityname', function(req, res, next) {
	// console.log("data for slug");
	cities.checkCityNameExists(req, res, next);
});
// ############################ City detail ######################################

// --- City detail page --- //
// router.get('/:cityname/', function(req, res) {
// 	//network.profileData(req, res);
// 	// console.log("data for slug = "+JSON.stringify(data));
// 	res.render('page', {"page_Code":"city-details","page_Title":"Profile"});
// });

// ############################ City edit ######################################

// --- City edit page --- //
router.post('/savecity', function(req, res, next) {
	// console.log("data for slug");
	cities.savecity(req, res, next);
});

// --- City edit action --- //
// router.post('/edit', function(req, res, next) {
// 	cities.saveCityData(req, res, next);
// });
module.exports = router;
