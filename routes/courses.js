var express = require('express');
var router = express.Router();

var courses = require('../controllers/courses');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.redirect(301, '/courses/list');
});

// --- Course template call --- //
router.get('/list', function (req, res, next) {
	let notify = '';
	if (req.session.notify) {
		notify = req.session.notify;
		delete req.session.notify;
	}
	// res.send(notify);
	res.render('page', { "page_Code": "courses", "page_Title": "Course Courses", "notify": notify });
});

// --- Course ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
	courses.getCourseList(req, res, next);
});

// --- Course name check --- //
router.post('/checkcoursename', function (req, res, next) {
	courses.checkCourseNameExists(req, res, next);
});

// --- Course add action--- //
router.post('/addcourse', function (req, res, next) {
	courses.createNewCourse(req, res, next);
});

// --- Course edit action --- //
router.post('/updatecourse', function (req, res, next) {
	courses.updateCourse(req, res, next);
});

// --- Course delete action --- //
router.post('/deletecourse', function (req, res, next) {
	courses.deleteCourse(req, res, next);
});

module.exports = router;
