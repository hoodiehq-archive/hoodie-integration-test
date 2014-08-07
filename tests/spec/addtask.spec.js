/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('add task test', function(test) {
  casper.start(hosts.www);
  require('../steps/addtask')(test);
});
