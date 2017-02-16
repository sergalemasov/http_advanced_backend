'use strict';

var express = require('express');
var router = express.Router();

var imgChanger = require('../services/img-changer');

router.post(
  '/img-changer/start',
  function(req, res, next) {
    imgChanger.start();
    res.sendStatus(200);
  }
);

router.post(
  '/img-changer/stop',
  function(req, res, next) {
    imgChanger.stop();
    res.sendStatus(200);
  }
);

router.get(
  '/img-changer/img-url-a',
  function(req, res, next) {
    var responseData;
    var url = imgChanger.getImgUrl();
    res.setHeader('ETag', '686897696a7c876b7e');
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/img-url-b',
  function(req, res, next) {
    var responseData;
    var url = imgChanger.getImgUrl();
    res.setHeader('Cache-Control', 'max-age=20');
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/img-url-c',
  function(req, res, next) {
    var responseData;
    var url = imgChanger.getImgUrl();
    res.setHeader('Cache-Control', 'max-age=1');
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/poke-name',
  function(req, res, next) {
    var responseData;
    var pokeName = imgChanger.getPokeName();
    res.json({pokeName: pokeName});
  }
);

module.exports = router;