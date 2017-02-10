var express = require('express');
var router = express.Router();
var passport = require('../middlewares/passport-auth');

/* GET home page. */
router.get(
  '/', 
  passport.authenticate('basic', {'session': false}), 
  function(req, res, next) {
    res.render('index', { title: 'Express' });
  }
);

module.exports = router;
