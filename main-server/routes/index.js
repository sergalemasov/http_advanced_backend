'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(
  '/',
  function(req, res, next) {
    res.render('index', { title: 'FED HTTP backend' });
  }
);

module.exports = router;
