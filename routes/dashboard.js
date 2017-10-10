var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log('Router index');
  // res.render('index', { title: 'Express' });
  res.render('page', {"page_Code":"dashboard","page_Title":"Dashboard"});
  // console.log('Router index 2');
});

module.exports = router;
