var aug = require('aug');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var resize = require('./resize');
var str = require('str.js');
var winston = require('winston');

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
      return str.format('/resize/{0}{1}', [profile, image]);
    }
  });
};

var saveImage = function(imageFile, data) {
  var dir = path.dirname(imageFile);
  mkdirp(dir, 0755, function (err) {
   if (err) {
    winston.error(err); 
   } else {
    fs.writeFile(imageFile, data, 'binary', function(err) {
      winston.info('diet: resized image saved', { file: imageFile });
    });
   }
  });
};

var getImage = function(image, profileName, callback) {
  var imageFile = path.join(options.imageDir, image);
  var resizeFile = path.join(options.resizeDir, profileName+"/"+image);
  var profile = options.profiles[profileName];
  if (!profile) {
    winston.error("diet: profile "+profileName+" doesn't exist");
    callback(true);
    return;
  }
  if (options.saveFiles && path.existsSync(resizeFile)) { //check if resized file exists
    winston.info('diet: file exists', { image: image, profileName: profileName, resizedFile: resizeFile });
    fs.readFile(resizeFile, 'binary', callback); 
  } else {
    winston.info('diet: resizing', { image: image, profileName: profileName });
    resize(imageFile, profile, function(err, data) {
      saveImage(resizeFile, data);
      callback(err, data);
    });
  }
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
        res.end(data, 'binary');
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
