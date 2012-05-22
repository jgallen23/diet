var cluster = require('cluster');
var cpus = require('os').cpus().length;
var debug = require('debug')('diet:cluster');
var server = require('./server');

module.exports = function(config, port) {
  var workers = [];


  if (cluster.isMaster) {
    // Fork workers.
    debug('master starting');
    for (var i = 0; i < cpus; i++) {
      workers.push(cluster.fork());
    }
    cluster.on('death', function(worker) {
      var index = workers.indexOf(worker);
      workers.splice(index, 1);
      debug('worker ' + worker.pid + ' died.');
      workers.push(cluster.fork());
    });

  } else {
    debug('child forked');
    server(config, port);
  }


  process.on('SIGTERM',function(){
    for(var i=0; i < workers.length; i++){
      workers[i].kill('SIGTERM');
    }
    process.exit(1);
  });
};
