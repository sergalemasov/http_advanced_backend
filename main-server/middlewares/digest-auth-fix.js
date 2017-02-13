module.exports = function (req, res, next) {
    req.url = (req.baseUrl ? req.baseUrl : "") + req.url;
    next();
}