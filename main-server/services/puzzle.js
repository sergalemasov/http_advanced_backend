'use strict';

var path = require('path');
var utils = require('../utils/utils');

var IMG_FOLDER = path.join('img', 'monkey');

var Puzzle = function () {}

var _proto = Puzzle.prototype;

_proto.getImgUrl = function (num) {
  return path.join(IMG_FOLDER, utils.toMd5(num) + '.jpeg');
}

_proto.getHeaders = function (num, server) {
  switch (+num) {
    case 1:
    case 5:
    case 4:
    case 9:
      return {
        'Access-Control-Allow-Origin': server,
        'Access-Control-Expose-Headers': 'src',
        'src': this.getImgUrl(num)
      }
    case 2:
    case 7:
    case 3:
      return {
        'Access-Control-Allow-Origin': server,
        'src': this.getImgUrl(num),
      }
    case 8:
    case 6:
      return {
        'Access-Control-Expose-Headers': 'src',
        'src': this.getImgUrl(num),
      }
  }
}

var puzzle = new Puzzle();

module.exports = puzzle;
