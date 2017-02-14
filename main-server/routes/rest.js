'use strict';

var express = require('express');
var router = express.Router();

var imgRenamer = require('../services/img-renamer');


router.get(
  '/img-renamer/start',
  function(req, res, next) {
    imgRenamer.start();
    res.sendStatus(200);
  }
);

router.get(
  '/img-renamer/stop',
  function(req, res, next) {
    imgRenamer.stop();
    res.sendStatus(200);
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
        res.sendStatus(500);
      });
  }
);

module.exports = router;