var express = require('express');
var router = express.Router();

var blogs = require('../controllers/blogs');

// --- GET blogs listing. --- //
router.get('/', function (req, res, next) {
    res.redirect(301, '/blogs/list');
});

router.get('/list', function (req, res, next) {
    res.render('page', { "page_Code": "blogs", "page_Title": "College User Blogs" });
});

// --- Blog ajax pages --- //
router.get('/page/:page_no', function (req, res, next) {
    blogs.getBlogsList(req, res, next);
});

// --- Blogs change status --- //
router.post('/changestate', function (req, res, next) {
    blogs.changeState(req, res, next);
});

// --- Delete item --- //
router.post('/delete', function (req, res, next) {
    blogs.deleteBlogs(req, res, next);
});
module.exports = router;