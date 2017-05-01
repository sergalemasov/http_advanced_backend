'use strict';

var express = require('express');
var router = express.Router();
var passport = require('../middlewares/passport-auth');
var digestFix = require('../middlewares/digest-auth-fix');

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
    res.setHeader('Last-Modified', imgChanger.getLastModifiedDate().toGMTString());
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/img-url-d',
  function(req, res, next) {
    var url = imgChanger.getImgUrl();
    var date = imgChanger.getLastModifiedDate();
    date.setSeconds(date.getSeconds() + 40);
    res.setHeader('Expires', date.toGMTString());
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/img-url-e',
  function(req, res, next) {
    var url = imgChanger.getImgUrl();
    res.json({imgUrl: url});
  }
);

router.get(
  '/img-changer/poke-name',
  function(req, res, next) {
    var pokeName = imgChanger.getPokeName();
    res.json({pokeName: pokeName});
  }
);

router.get('/auth/basic',
  passport.authenticate('basic', {'session': false}),
  function(req, res, next) {
    res.json({
      'status':'success',
      'authType': 'Basic'
    });
  }
);

router.get('/auth/digest',
  [digestFix, passport.authenticate('digest', {'session': false})],
  function(req, res, next) {
    res.json({
      'status':'success',
      'authType': 'Digest'
    });
  }
);

module.exports = router;