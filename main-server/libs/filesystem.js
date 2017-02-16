'use strict';

var fs = require('fs-extra');

module.exports = {
  fileExist: function (filepath) {
    var promise = new Promise(function(resolve, reject) {
      fs.open(filepath, 'r', function (err, fd) {
        if (err) {
          if (err.code === "ENOENT") {
            resolve(false);
          } else {
            reject(err);
          }
        } else {
          resolve(true);
        }
      });
    });
    return promise;
  },

  removeFile: function (filepath) {
    var promise = new Promise(function(resolve, reject) {
      fs.unlink(filepath, function (err) {
        if (err) {
          if (err.code !== "ENOENT") {
            reject(err);
          } else {
            resolve(false);
          }
        } else {
          resolve(filepath);
        }
      });
    });
    return promise;
  },

  copyFile: function (source, target) {
    var promise = new Promise(function(resolve, reject) {
      fs.copy(source, target, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(target);
        }
      });
    });
    return promise;
  }
};