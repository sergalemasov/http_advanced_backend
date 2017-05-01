'use strict';

var utils = require('../utils/utils');

function Digest () {
  this.nonceMap = {};
}

var _proto = Digest.prototype;

_proto.config = function (options) {
  this.getUserHelper = options.getUserHelper;
  this.realm = options.realm || 'somerealm';

  this.qop = options.qop === 'auth' ? options.qop : '';
  this.algorithm = options.algorithm === 'MD5-sess' && options.qop === 'auth' ? options.algorithm : 'MD5';
}

_proto.run = function () {
  return function (req, res, next) {
    this._authenticate(req, function (result) {
      if (result.success) {
        next();
      } else if (result.err) {
        console.log(result.err);
        res.sendStatus(500);
        return;
      } else {
        this._respondUnauthorized(res, result);
      }
    });
  }.bind(this)
};

_proto._authenticate = function (req, callback) {
  var header,
      clientOptions,
      authorizationHeaderName = 'authorization',
      cb = callback.bind(this);

  header = req.headers[authorizationHeaderName];

  if (header) {
    clientOptions = this._parseAuthorizationHeader(header);

    if (clientOptions) {
      this._validateClientOptions(req.method, clientOptions, function (result) {
        cb(result);
      });

      return;
    }
  }

  cb({});
};

_proto._respondUnauthorized = function (res, result) {
  var stale = result.stale || false,
      nonce = this._generateNonce();

  res.setHeader('WWW-Authenticate', this._makeHeader(nonce, stale));
  res.status(401).send('unauthorized');
};

_proto._generateNonce = function () {
  var uidLen = 32,
      nonce = utils.uid(uidLen);

  this.nonceMap[nonce] = {
    nc: 0,
    created: Date.now()
  }

  return nonce;
};

_proto._makeHeader = function (nonce, stale) {
  var header = (
    'Digest ' +
    'realm=' + this.realm + ', '
  );

  if (this.qop) {
    header += 'qop=' + this.qop + ', ';
  }

  header += (
    'nonce=' + nonce + ', ' +
    'algorithm=' + this.algorithm + ', ' +
    'stale=' + stale
  );
  return header;
};

_proto._parseAuthorizationHeader = function (header) {

  var digestSchemeName = 'Digest';

  if (header.indexOf(digestSchemeName) !== 0 ) {
    return {};
  }

  var optionsMap = {},
      tokens,
      tokenSeparatorRegexp = /,(?=(?:[^"]|"[^"]*")*$)/,
      optionsPairRegexp = /(\w+)=["]?([^"]*)["]?$/;

  tokens = header.slice(digestSchemeName.length).split(tokenSeparatorRegexp);

  tokens.forEach(function (token) {
    var matchedPair = optionsPairRegexp.exec(token);
    if (matchedPair) {
      optionsMap[matchedPair[1]] = matchedPair[2];
    }
  });

  return optionsMap;
};

_proto._validateClientOptions = function (method, clientOptions, callback) {
  var cb = callback.bind(this);
  var self = this;

  if (!this._validateNonce(clientOptions.nonce, clientOptions.qop, clientOptions.nc)) {
    cb({'stale': true});
    return;
  }

  this.getUserHelper(clientOptions.username, function (err, username, password) {
    if (err) {
      cb({'err': err});
      return
    }

    var validated = false;
    if (username && password) {
      validated = self._validateCredentials(method, clientOptions, password);
    }

    if (validated) {
       cb({'success': validated});
    } else {
      cb({});
    }
  });
};

_proto._validateNonce = function (nonce, qop, nc) {
  if (!this.nonceMap[nonce]) {
    return false;
  }

  var expirationTime = 3600000,  // one hour
      now = Date.now();

  if (this.nonceMap[nonce].created + expirationTime <= now) {
    delete this.nonceMap[nonce];
    return false;
  }

  if (qop && !(nc && nc > this.nonceMap[nonce].nc)) {
    return false;
  }

  return true;
};

_proto._validateCredentials = function (method, clientOptions, password) {
  var ha1 = this._makeHa1(
    clientOptions.username,
    clientOptions.realm,
    password,
    clientOptions.algorithm,
    clientOptions.nonce,
    clientOptions.cnonce
  );

  var ha2 = this._makeHa2(method, clientOptions.uri);

  var response;
  if (clientOptions.qop) {
    response = utils.toMd5(
      ha1 + ':' +
      clientOptions.nonce + ':' +
      clientOptions.nc + ':' +
      clientOptions.cnonce + ':' +
      clientOptions.qop + ':' +
      ha2);
  } else {
    response = utils.toMd5(ha1 + ':' + clientOptions.nonce + ':' + ha2);
  }

  return response === clientOptions.response;
};

_proto._makeHa1 = function (username, realm, password, algorithm, nonce, cnonce) {
  var ha1 = utils.toMd5(username + ':' + realm + ':' + password);

  if (algorithm === 'MD5-sess') {
    ha1 = utils.toMd5(ha1 + ':' + nonce +  ':' + cnonce);
  }

  return ha1;
};

_proto._makeHa2 = function (method, digestUri) {
  return utils.toMd5(method + ':' + digestUri);
};

var digest = new Digest();

module.exports = digest;
