var express = require('express');
var router = express.Router();

var login = require('../controllers/login');

router.get('/', (req, res) => {
	res.render('login');
});

router.post('/', (req, res) => {
	console.log('Post for login router');
	login.userLogin(req, res);
});

module.exports = router;
