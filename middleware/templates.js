module.exports = function (options) {
  options = options || {};
  return function (req, res, next) {
    req.locals = {url: req.url};
    next();
  }
}