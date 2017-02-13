'use strict';

var express = require('express');
var router = express.Router();
var passport = require('../middlewares/passport-auth');
var digestFix = require('../middlewares/digest-auth-fix');

/* GET users listing. */
router.get('/basic',
  passport.authenticate('basic', {'session': false}),
  function(req, res, next) {
    res.render('auth-success', { 'authType': 'Basic' });
  }
);

router.get('/digest',
  [digestFix, passport.authenticate('digest', {'session': false})],
  function(req, res, next) {
    res.render('auth-success', { 'authType': 'Digest' });
  }
);

module.exports = router;
