var aug = require('aug');
var debug = require('debug')('diet');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var resize = require('./resize');

var defaults = {
  outputPath: '',
  imagePath: '',
  route: '/',
  profiles: {}
};

var Diet = function(config) {
  if (typeof config === 'string') {
    var str = fs.readFileSync(config, 'utf8');
    config = JSON.parse(str);
  }
  this.opts = aug(true, {}, defaults, config);

};

Diet.prototype.resize = function(imagePath, profileName, callback) {
  var self = this;
  var profile = this.opts.profiles[profileName];
  if (!profile)
    throw new Error('invalid profile name');

  debug('resize %s with profile %s', imagePath, profileName);
  path.exists(imagePath, function(exists) {
    if (!exists)
      return callback(new Error('image file not found'));

    var filename = path.basename(imagePath);
    var outFilePath = path.join(self.opts.outputPath, profileName, filename);

    path.exists(outFilePath, function(exists) {
      if (exists) {
        debug('already exists %s', outFilePath);
        return callback(null, false, false, outFilePath);
      }

      resize(imagePath, profile, function(err, data) {
        if (err) return callback(err);


        //create out directory
        var dir = path.dirname(outFilePath);
        mkdirp(dir, 0755, function (err) {
          if (err) throw err; 
        
          fs.writeFile(outFilePath, data, 'binary', function(err) {
            callback(err, true, data, outFilePath);

          });
        });

      });

    });


  }); 
};


module.exports = Diet;
