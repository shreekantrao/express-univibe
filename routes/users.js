var express = require('express');
var router = express.Router();

var users = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('page', {"page_Code":"users","page_Title":"College Users"});
});


// ----- ajax call -----
router.get('/delete', (req, res, next) => {
		// login.userLogin(req, res);
  try{
    let data = User.deleteUserById(req)
    // console.dir('data - '+data);
    if(err) {
      return res.json({success: false, msg: 'User not found'});
    }else{
      return res.json({success: true, msg: 'User deleted'});
    }
  } catch(e){
    next(e);
  };
});

router.get('/userslist', (req, res, next) => {
	console.log('router userslist');
	users.userslist(req, res, next);
});

router.get('/userslist_', async (req, res, next) => {
  try {
    let data = await User.getUserList(req)
    if(!data) {
      return res.json({success: false, msg: 'Users not found'});
    }
    // data.toString().replace('"_id"','"id"');
    res.json(data);
  } catch(e) {
    next(e);
  }
});

module.exports = router;
