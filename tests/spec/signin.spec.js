/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignIn test', function(test) {
  casper.start(hosts.www);
  require('../steps/signin')(test);
});
