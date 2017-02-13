'use strict';

var fs = require('fs');
var path = require('path');

var ABS_ROOT = path.dirname(__dirname);
var BASE_IMG_FOLDER = path.join('public', 'img', 'renaming');
var ABS_IMG_FOLDERS = ['a', 'b', 'c'].map(function (dirName) {
  return path.join(ABS_ROOT, BASE_IMG_FOLDER, dirName);
});

var IMG_FILES = [
  "abra.png",
  "bullbasaur.png",
  "charmander.png",
  "eevee.png",
  "mankey.png",
  "mew.png",
  "pikachu-2.png",
  "rattata.png",
  "squirtle.png",
  "weedle.png",
  "bellsprout.png",
  "caterpie.png",
  "dratini.png",
  "jigglypuff.png",
  "meowth.png",
  "pidgey.png",
  "psyduck.png",
  "snorlax.png",
  "venonat.png",
  "zubat.png"
];

var CURRENT_IMG_FILE = 'current.png';
var TEMP_IMG_FILE = 'temp.png';

var ImgRenamer = function () {
  this.active = false;
  this.oldFilePath = null;
};

var _proto = ImgRenamer.prototype;

_proto.start = function () {

};

_proto.stop = function () {

};

_proto._rename = function() {

};

_proto._clearOldCurrents = function () {
  this._forEachDir(function (dirPath) {
    fs.access()
  });
};

_proto._forEachDir = function (cb) {
  var args = arguments;
  ABS_IMG_FOLDERS.forEach(function (dirPath) {
    cb.apply(this, dirPath, args)
  }.bind(this));
};

module.exports = new ImgRenamer;
