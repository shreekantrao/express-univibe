var express = require('express');
var router = express.Router();

var courses = require('../controllers/courses');

// ############################ Course list page ######################################

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect(301,'/courses/list');
});

router.get('/list', function(req, res, next) {
	// console.log("alphabet = "+req.params.alphabet);
	let notify = '';
	if(req.session.notify){
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', {"page_Code":"courses","page_Title":"Course Course","notify":notify});
});

// ############################ Course list page ######################################

router.get('/page/:page_no', function(req, res, next) {
	// console.log('router userslist');
	courses.getCourseList(req, res, next);
});

// ############################ Course add ######################################

// --- Course add page --- //
// router.get('/add', function(req, res) {
// 	//network.profileData(req, res);
// 	let notify = '';
// 	if(req.session.notify){
// 		notify = req.session.notify;
// 		delete req.session.notify;
// 	}
// 	res.render('page', {"page_Code":"course-form","page_Title":"Add new Course","notify":notify});
// });

// --- Course add acction--- //
router.post('/addnew', function(req, res, next) {
	courses.createNewCourse(req, res, next);
	
	// console.log("data for slug = "+JSON.stringify(data));
	// res.render('page', {"page_Code":"course-form","page_Title":"Add new Course"});
});

router.post('/checkcoursename', function(req, res, next) {
	// console.log("data for slug");
	courses.checkCourseNameExists(req, res, next);
});
// ############################ Course detail ######################################

// --- Course detail page --- //
// router.get('/:coursename/', function(req, res) {
// 	//network.profileData(req, res);
// 	// console.log("data for slug = "+JSON.stringify(data));
// 	res.render('page', {"page_Code":"course-details","page_Title":"Profile"});
// });

// ############################ Course edit ######################################

// --- Course edit page --- //
router.post('/savecourse', function(req, res, next) {
	// console.log("data for slug");
	courses.savecourse(req, res, next);
});

// --- Course edit action --- //
// router.post('/edit', function(req, res, next) {
// 	courses.saveCourseData(req, res, next);
// });
module.exports = router;
