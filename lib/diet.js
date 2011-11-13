var fs = require('fs');
var path = require('path');
var str = require('str.js');
var resize = require('./resize');
var aug = require('aug');
var cwd = process.cwd();

var options = {
  assetDir: 'public',
  profiles: {} 
};

var addHelper = function(app) {
  app.helpers({
    resize: function(image, profile) {
      return str.format('/resize/{0}{1}', [profile, image]);
    }
  });
};

var addRoute = function(app) {
  app.get('/resize/:profile/*', function(req, res) {
    var profileName = req.params.profile;
    var image = req.params[0];
    var profile = options.profiles[profileName];
    if (profile) {
      var imageFile = path.join(cwd, options.assetDir+'/'+image);

      resize(imageFile, profile, function(err, data) {
        res.contentType('image/jpeg');
        res.end(data, 'binary');
      });

    } else {
      res.send("invalid profile name", 500);
    }
  });
};

var readConfig = function() {
  if (options.profilesConfig) {
    var profiles = JSON.parse(fs.readFileSync(options.profilesConfig));
    aug(options.profiles, profiles);
  }
};

var use = function(app, opts) {
  aug(options, opts);
  readConfig();
  addRoute(app);
  addHelper(app);
};


module.exports = {
  use: use 
};
