'use strict';

// https://blog.mattjustice.com/2016/04/23/digest-authentication-with-express-4/
module.exports = function (req, res, next) {
    req.url = (req.baseUrl ? req.baseUrl : "") + req.url;
    next();
}