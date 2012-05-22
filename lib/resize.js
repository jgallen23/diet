var im = require('imagemagick');
var fs = require('fs');
var aug = require('aug');
var path = require('path');
var debug = require('debug')('diet:resize');

var resize = function(imageFile, profile, callback) {
  path.exists(imageFile, function(exists) {
    if (exists) {
      fs.readFile(imageFile, 'binary', function(err, data) {
        if (err) return callback(err);
        aug(profile, { srcData: data });
        try {
          im.resize(profile, function(err, stdout, stderr) {
            debug('image resized %s', imageFile);
            if (callback) callback(err, stdout);
          }); 
        } catch(e) {
          if (callback) callback(e);
        }
      });
    } else {
      debug('image file can\'t be found %s', imageFile);
      callback(new Error('img file missing'));
    }
  });
};

module.exports = resize;
