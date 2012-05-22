var Diet = require('../../');

var config = {
  imagePath: __dirname + '/img',
  outputPath: __dirname + '/resized',
  profiles: {
    thumbnail: {
      width: 100,
      height: 100
    }
  }
};

var port = process.argv[2] || 8000;
console.log('Diet server started on port '+port);
Diet.server(config, port);
