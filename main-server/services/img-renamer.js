'use strict';

var path = require('path'),
    filesystem = require('../libs/filesystem');

var ABS_ROOT = path.dirname(__dirname),
    BASE_IMG_FOLDER = path.join('public', 'img', 'renaming'),
    IMG_FOLDER_NAMES = ['a', 'b', 'c'],
    IMG_FOLDERS = IMG_FOLDER_NAMES.map(function (dirName) {
      return path.join(BASE_IMG_FOLDER, dirName);
    }),
    ABS_BASE_IMG_FOLDER = path.join(ABS_ROOT, BASE_IMG_FOLDER),
    ABS_IMG_FOLDERS = IMG_FOLDER_NAMES.map(function (dirName) {
      return path.join(ABS_BASE_IMG_FOLDER, dirName);
    }),
    CURRENT_IMG_FILE = 'current.png',
    TEMP_IMG_FILE = 'temp.png';

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

var ImgRenamer = function () {
  this.state = this.STATES.OFF;
  this.ioResolves = [];
  this.ioRejects = [];
};

var _proto = ImgRenamer.prototype;

_proto.clearOldFiles = function () {
  var checkList = [];
  ABS_IMG_FOLDERS.forEach(function(folder) {
    checkList.push(path.join(folder, CURRENT_IMG_FILE));
    checkList.push(path.join(folder, TEMP_IMG_FILE));
  });

  return Promise.all(
    checkList.map(function (filePath) {
      var promise = new Promise(function(resolve, reject) {
        filesystem.fileExist(filePath)
          .then(function(exist) {
            if (exist) {
              return filesystem.removeFile(filePath)
            }
          })
          .then(function (res) {
            if (typeof(res) === 'string' && 
                res.indexOf(ABS_BASE_IMG_FOLDER) > -1) 
            {
              console.log('deleted:', res);
            }
            resolve(res);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    })
  );
};

_proto.IOwait = function () {
  if (this.state === this.STATES.IO) {
    var promise = new Promise(function (resolve, reject) {
      this.ioResolves.push(resolve);
      this.ioRejects.push(reject);
    }.bind(this));

    return promise;
  } else {
    return Promise.resolve();
  }
}

_proto.getImgUrls = function () {
  return IMG_FOLDERS.map(function(folder) {
    return path.join(folder, CURRENT_IMG_FILE);
  });
}

_proto.start = function () {
  this.state = this.STATES.IO;
  this.clearOldFiles()
    .then(function() {
      this.state = this.STATES.ON;
      this._swapLoop();
    }.bind(this))
    .catch(function(err) {
      console.log('Error:', err);
      this._rejectPendingPromises(err);
      this.stop();
    }.bind(this));
};

_proto.stop = function () {
  this.state = this.STATES.OFF;
};

_proto._resolvePendingPromises = function () {
  var resolvesLen = this.ioResolves.length;
  if (resolvesLen) {
    this.ioResolves.forEach(function(resolve) {
      resolve();
    });
    this.ioResolves = [];
  }
};

_proto._rejectPendingPromises = function (err) {
  var rejectsLen = this.ioRejects.length;
  if (rejectsLen) {
    this.ioRejects.forEach(function(reject) {
      reject(err);
    });
    this.ioRejects = [];
  }
};

_proto._swapLoop = function () {
  if (this.state === this.STATES.ON) {
    this._swapCurrentFile()
      .then(function () {
        this._resolvePendingPromises();
        setTimeout(function () {
          this._swapLoop();
        }.bind(this), this.SWAP_INTERVAL);
      }.bind(this))
      .catch(function (err) {
        console.log('Error:', err);
        this._rejectPendingPromises(err);
        this.stop();
      }.bind(this));
  }
};

_proto._swapCurrentFile = function() {
  this.state = this.STATES.IO;
  var randomFileName = this._getRandomFilename();
  return Promise.all(
    ABS_IMG_FOLDERS.map(function (folderName) {
      var promise = new Promise(function (resolve, reject) {
        var currentFilePath = path.join(folderName, CURRENT_IMG_FILE);
        var randomFilePath = path.join(folderName, randomFileName); 

        filesystem.fileExist(currentFilePath)
          .then(function(exist) {
            if (exist) {
              return filesystem.removeFile(currentFilePath);
            }
          })
          .then(function() {
            return filesystem.copyFile(randomFilePath, currentFilePath);
          })
          .then(function () {
            this.state = this.STATES.ON;
            resolve();
          }.bind(this))
          .catch(function(err) {
            reject(err);
          });
      }.bind(this));
      return promise;  
    }.bind(this))
  );  
};

_proto._getRandomFilename = function () {
  return IMG_FILES[Math.floor(Math.random() * IMG_FILES.length)];
};

_proto.STATES = Object.freeze({
  ON: 0,
  IO: 1,
  OFF: 2
});

_proto.SWAP_INTERVAL = 5000;

var imgRenamer = new ImgRenamer();

module.exports = imgRenamer;
