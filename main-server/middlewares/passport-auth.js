'use strict';

var passport = require('passport'),
    userModel = require('../models/user'),
    DigestStrategy = require('passport-http').DigestStrategy,
    BasicStrategy = require('passport-http').BasicStrategy;


passport.use(new BasicStrategy(
  function(username, password, cb) {
    userModel.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

passport.use(new DigestStrategy(
  { qop: 'auth' },
  function(username, cb) {
    userModel.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user, user.password);
    })
  }
));

module.exports = passport;