var Diet = require('./lib/diet');
Diet.server = require('./lib/server');
Diet.handler = require('./lib/handler');
Diet.cluster = require('./lib/cluster');
module.exports = Diet;

