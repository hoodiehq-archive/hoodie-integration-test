/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignUp test', function(test) {
  var username = 'hoodieusersignupcheck'
  casper.start(hosts.www);
  require('../steps/signup')(test, {
    username: username,
    password: 'hoodiepass'
  });
});
