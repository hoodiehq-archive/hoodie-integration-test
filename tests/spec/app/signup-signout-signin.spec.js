/*global casper:false */
var hosts = require('../../hosts.json');

casper.test.begin('Sign up -> sign out -> sign in', function(test) {
  var username = 'hoodieusersignincheck';
  casper.start(hosts.www);


  require('../../steps/app/signup')(test, {
    username: username,
    password: 'hoodiepass'
  });
  casper.waitForSelectorTextChange('.hoodie-username');
   casper.then(function() {
    test.assertSelectorHasText('.hoodie-username', username);
  });

  require('../../steps/app/signout')(test);
  casper.waitForSelectorTextChange('.hoodie-username');

  require('../../steps/app/signin')(test, {
    username: username,
    password: 'hoodiepass'
  });

  casper.waitForSelectorTextChange('.hoodie-username');
  casper.then(function() {
    test.assertSelectorHasText('.hoodie-username', username);
  });
});
