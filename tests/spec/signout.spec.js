/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignOut test', function(test) {
  casper.start(hosts.www);
  require('../steps/signup')(test);
  require('../steps/signout')(test);
});
