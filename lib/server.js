var http = require('http');
var handler = require('./handler');
var debug = require('debug')('diet:server');

module.exports = function(config, port) {

  http.createServer(handler(config)).listen(port, '127.0.0.1');
  debug('server started on port %d', port);
};


