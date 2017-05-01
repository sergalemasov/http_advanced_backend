'use strict';

var express = require('express');
var router = express.Router();
var passport = require('../middlewares/passport-auth');
var digestFix = require('../middlewares/digest-auth-fix');
var digest = require('../middlewares/digest-auth');
var userModel = require('../models/user');

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

// digest.config({
//   realm: 'OLOLO',
//   qop: 'auth',
//   // algorithm: 'MD5-sess',
//   getUserHelper: function (username, cb) {
//     userModel.findByUsername(username, function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       return cb(null, user, user.password);
//     })
//   }
// });

router.get('/digest',
  digest.run(),
  function(req, res, next) {
    res.render('auth-success', { 'authType': 'Digest' });
  }
);

router.get('/fb-oauth',
  function(req, res, next) {
    res.render('fb-oauth', {});
  }
);

module.exports = router;
