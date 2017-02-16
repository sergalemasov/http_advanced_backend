'use strict';

var path = require('path');

var IMG_FOLDER = path.join('img', 'pokemons');

var IMG_FILES = [
  "abra.png",
  "bullbasaur.png",
  "charmander.png",
  "eevee.png",
  "mankey.png",
  "mew.png",
  "pikachu.png",
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

var ImgChanger = function () {
  this.state = this.STATES.OFF;
  this.url = null;
  this.stopTimeoutId = null;
  this.swapTimeoutId = null;
};

var _proto = ImgChanger.prototype;

_proto.start = function () {
  if (this.state === this.STATES.ON) {
    this.stop();
  }
  this.state = this.STATES.ON;
  this.stopTimeoutId = setTimeout(this.stop.bind(this), this.STOP_TIMEOUT);
  this._swapLoop();
}

_proto.stop = function () {
  this.state = this.STATES.OFF;
  clearTimeout(this.swapTimeoutId);
  clearTimeout(this.stopTimeoutId);
}

_proto.getImgUrl = function () {
  clearTimeout(this.stopTimeoutId);
  this.stopTimeoutId = setTimeout(this.stop.bind(this), this.STOP_TIMEOUT);
  return this.url;
}

_proto._swapLoop = function () {

  if (this.state !== this.STATES.OFF) {
    this.url = path.join(IMG_FOLDER, this._getRandomFilename());
    this.swapTimeoutId = setTimeout(this._swapLoop.bind(this), this.SWAP_INTERVAL);
  }
}

_proto._getRandomFilename = function () {
  return IMG_FILES[Math.floor(Math.random() * IMG_FILES.length)];
};

_proto.STATES = Object.freeze({
  ON: 0,
  OFF: 1
});

_proto.SWAP_INTERVAL = 5000;
_proto.STOP_TIMEOUT = 5000;

var imgChanger = new ImgChanger();

module.exports = imgChanger;