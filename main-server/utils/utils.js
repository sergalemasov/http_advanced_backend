'use strict';

var crypto = require('crypto');

function uid (len) {
  var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[Math.random() * charlen | 0]);
  }

  return buf.join('');
};

function toMd5 (data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = {
  uid: uid,
  toMd5: toMd5
};