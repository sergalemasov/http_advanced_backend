'use strict';

var express = require('express');
var router = express.Router();
var ip = require('../services/get-ip');

router.get(
  '/',
  function(req, res, next) {
    res.render('puzzle', {server: ip + ':3001'});
  }
);

module.exports = router;