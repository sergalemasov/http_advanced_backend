'use strict';

var express = require('express');
var router = express.Router();

router.get(
  '/',
  function(req, res, next) {
    res.render('img-changer', {});
  }
);

module.exports = router;