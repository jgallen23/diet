#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var Diet = require('../');


var list = function(val) {
  return val.split(',');
};

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-s, --server <port>', 'Start web server on <port>')
  .usage('[options] <config file>')
  .parse(process.argv);


var usage = function() {
  process.stdout.write(program.helpInformation());
  program.emit('--help');
  process.exit(1);
};

if (program.args.length !== 0) {

  if (program.server) {
    var config = program.args[0];

    Diet.cluster(config, program.server);
  } else {
    usage();
  }
} else {
  usage();
}
