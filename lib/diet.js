var aug = require('aug');
var debug = require('debug')('diet');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var resize = require('./resize');

var defaults = {
  outputPath: '',
  imagePath: '',
  profiles: {},
  maxAge: 60 * 60 * 24 * 14 
};

var readJSON = function(file) {
  var str = fs.readFileSync(file, 'utf8');
  return JSON.parse(str);
};

var Diet = function(config) {
  //config might be a path
  if (typeof config === 'string') 
    config = readJSON(config);
  this.opts = aug(true, {}, defaults, config);
  //profiles might be a path
  if (typeof this.opts.profiles === 'string') 
    this.opts.profiles = readJSON(this.opts.profiles);

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

    var filename = imagePath.replace(self.opts.imagePath, '');
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
