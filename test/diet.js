var assert = require('assert');

var Diet = require('../lib/diet');

suite('Diet', function() {

  suite('init', function() {
    test('should take in a config object', function() {
      var d = new Diet({ outputPath: 'public/resized' });
      assert.equal(d.opts.outputPath, 'public/resized');
    });
    test('should take a filepath', function() {
      var diet = new Diet(__dirname+'/fixtures/config.json');
      assert.equal(diet.opts.outputPath, 'out');
    });
  });

  suite('#resize', function(done) {
    var diet;
    setup(function() {
      diet = new Diet({
        outputPath: __dirname+'/out',
        profiles: {
          profile1: {
            width: 100,
            height: 100
          }
        }
      });
    });
    test('should take img path and profile name and callback with error, created, data and new path', function(done) {
      var img = __dirname+'/img/steve-jobs.jpg';
      diet.resize(img, 'profile1', function(err, created, data, filepath) {
        assert.ok(!err);
        assert.ok(data);
        assert.ok(created);
        assert.equal(filepath, __dirname+'/out/profile1/steve-jobs.jpg');
        done();
      });
    });

    test('should error if file doesn\'t exists', function(done) {
      var img = __dirname+'/img/steve-jobs2.jpg';
      diet.resize(img, 'profile1', function(err, data, filepath) {
        assert.ok(err);
        assert.equal(err.message, 'image file not found');
        done();
      });
      
    });

    test('should not create if file exists', function(done) {

      var img = __dirname+'/img/steve-jobs.jpg';
      diet.resize(img, 'profile1', function(err, created, data, filepath) {
        assert.ok(!err);
        assert.ok(!data); //will change later when switching to streams
        assert.ok(!created);
        assert.equal(filepath, __dirname+'/out/profile1/steve-jobs.jpg');
        done();
      });
      
    });

    test('should verify profile exists', function() {
      assert.throws(function() {
        diet.resize('poop', 'profile2', function() {});
      }, "invalid profile name");
    });
    
    
    
  });
  
});
