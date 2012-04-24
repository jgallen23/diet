var aug = require('aug');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var resize = require('./resize');
var strf = require('strf');
var debug = require('debug')('diet');
var filed = require('filed');

var cwd = process.cwd();

var options = {
  saveFiles: true,
  imageDir: path.join(cwd, 'public'),
  resizeDir: path.join(cwd, 'public/resized'),
  profiles: {} 
};

var addHelper = function(app) {
  app.helpers({
    resize: function(image, profile) {
      return strf('/resize/{0}{1}', profile, image);
    }
  });
};

var saveImage = function(imageFile, data) {
  var dir = path.dirname(imageFile);
  mkdirp(dir, 0755, function (err) {
   if (err) {
    throw err; 
   } else {
    fs.writeFile(imageFile, data, 'binary', function(err) {
      debug('resized %s', imageFile);
    });
   }
  });
};

var getImage = function(image, profileName, callback) {
  var imageFile = path.join(options.imageDir, image);
  var resizeFile = path.join(options.resizeDir, profileName+"/"+image);
  var profile = options.profiles[profileName];
  if (!profile) {
    throw new Error('profile '+profileName+' doesn\'t exist');
    callback(true);
    return;
  }
  path.exists(resizeFile, function(exists) {
  if (exists) { //check if resized file exists
    debug('file exists: %s', resizeFile);
    callback(null, resizeFile);
  } else {
    debug('resizing: %s (%s)', image, profileName);
    resize(imageFile, profile, function(err, data) {
      if (err) return callback(err);
      saveImage(resizeFile, data);
      callback(err, data);
    });
  }

  });

};

var addRoute = function(app) {
  app.get('/resize/:profile/*', function(req, res) {
    var profileName = req.params.profile;
    var image = req.params[0];
    getImage(image, profileName, function(err, data) {
      if (err) {
        res.send("something bad happened", 500);
      } else {
        res.contentType('image/jpeg');
        if (typeof data == 'string') {
          var stream = fs.createReadStream(data);
          stream.pipe(res);
        } else {
          res.end(data, 'binary');
        }
      }
    });
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
