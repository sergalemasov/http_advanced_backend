'use strict';

var express = require('express');
var router = express.Router();

var puzzle = require('../services/puzzle');

router.get(
  '/puzzle/:num',
  function(req, res, next) {
    var url = puzzle.getImgUrl(req.params.num);
    var headers = puzzle.getHeaders(req.params.num, req.query.origin);
    res.set(headers);
    res.json({status: 'ok'});
  }
);

router.put(
  '/puzzle/:num',
  function(req, res, next) {
    var url = puzzle.getImgUrl(req.params.num);
    var headers = puzzle.getHeaders(req.params.num, req.query.origin);
    res.set(headers);
    res.json({status: 'ok'});
  }
);

module.exports = router;