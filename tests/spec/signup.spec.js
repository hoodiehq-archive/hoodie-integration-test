/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignUp test', function(test) {
  casper.start(hosts.www);
  require('../steps/signup')(test, {
    username: 'hoodieuser',
    password: 'hoodiepass'
  });
});
