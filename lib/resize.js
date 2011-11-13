var im = require('imagemagick');
var fs = require('fs');
var aug = require('aug');
var cwd = process.cwd();

var resize = function(imageFile, profile, callback) {
  var imgData = fs.readFileSync(imageFile, 'binary');
  aug(profile, { srcData: imgData });
  im.resize(profile, function(err, stdout, stderr) {
    if (callback) callback(err, stdout);
  }); 
};

module.exports = resize;
