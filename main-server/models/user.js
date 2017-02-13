'use strict';

var users = require('../json/users.json');

var findByUsername = function (username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
};

exports.findByUsername = findByUsername;