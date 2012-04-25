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

Diet.server(config, 8001);
