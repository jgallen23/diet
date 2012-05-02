var Diet = require('./diet');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('diet:handler');

module.exports = function(config) {

  var diet = new Diet(config);

  if (!diet.opts.imagePath)
    throw new Error('must pass in imagePath');

  var error = function(res, error) {
    if (error.message == 'image file not found') {
      res.statusCode = 404;
    } else {
      res.statusCode = 500;
    }
    res.end(error.message);
  };

  return function(req, res) {
    if (req.url == '/favicon.ico') {
      res.statusCode = 404;
      return res.end();
    }
    var split = req.url.split('/');
    split.shift(); //kill empty first item
    var profile = split.shift();
    var file = split.join('/');

    debug('request: %s; profile: %s; file: %s', req.url, profile, file);


    var img = path.join(diet.opts.imagePath, file);
    try {
      diet.resize(img, profile, function(err, created, data, filename) {
        if (err) return error(res, err);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age='+diet.opts.maxAge);
        if (!data) {
          fs.stat(filename, function(err, stat) {
            res.setHeader('Last-Modified', stat.mtime.toUTCString());
            var stream = fs.createReadStream(filename);
            stream.pipe(res);
          });
        } else {
          res.setHeader('Last-Modified', new Date().toUTCString());
          res.end(data, 'binary');
        }
      });
    } catch(e) {
      return error(res, e);
    }
  };

};
