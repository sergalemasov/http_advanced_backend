'use strict';

var express = require('express');
var router = express.Router();

var imgRenamer = require('../services/img-renamer');


router.post(
  '/img-renamer/start',
  function(req, res, next) {
    imgRenamer.start();
    res.code(200);
  }
);

router.post(
  '/img-renamer/stop',
  function(req, res, next) {
    imgRenamer.stop();
    res.code(200);
  }
);

router.get(
  '/img-renamer/img-url',
  function(req, res, next) {
    var responseData;
    imgRenamer.IOwait()
      .then(function () {
        responseData = {
          imgUrls: imgRenamer.getImgUrls()
        }
        res.json(responseData);
      })
      .catch(function (err) {
        res.code(500);
      });
  }
);

module.exports = router;