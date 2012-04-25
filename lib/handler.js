var Diet = require('./diet');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('diet:handler');

module.exports = function(config) {

  var diet = new Diet(config);

  if (!config.imagePath)
    throw new Error('must pass in imagePath');

  var error = function(res, error) {
    res.statusCode = 500;
    res.end(error.message);
  };

  return function(req, res) {
    if (req.url == '/favicon.ico') {
      res.statusCode = 404;
      return res.end();
    }
    debug('request: %s', req.url);
    var split = req.url.split('/');
    var profile = split[1];
    var file = split[2];
    var img = path.join(config.imagePath, file);
    try {
      diet.resize(img, profile, function(err, created, data, filename) {
        if (err) return error(res, err);
        res.setHeader('Content-Type', 'image/jpeg');
        if (!data) {
          var stream = fs.createReadStream(filename);
          stream.pipe(res);
        } else {
          res.end(data, 'binary');
        }
      });
    } catch(e) {
      return error(res, e);
    }
  };

};
