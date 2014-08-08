/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignIn with correct credentials test', function(test) {
  var username = 'hoodieusersignincheck';
  casper.start(hosts.www);

  require('../steps/signup')(test, {
    username: username,
    password: 'hoodiepass'
  });
  casper.waitForSelectorTextChange('.hoodie-username',
    function waitForSignUpTextSuccess() {
      casper.capture('./debug/signup-02-success.png');
      test.assertSelectorHasText('.hoodie-username', username);
    }, function waitForSignUpTextError() {
      casper.capture('./debug/signup-02-fail.png');
      test.assertSelectorHasText('.hoodie-username', username);
  });
  require('../steps/signout')(test);
  casper.waitForSelectorTextChange('.hoodie-username');

  require('../steps/signin')(test, {
    username: username,
    password: 'hoodiepass'
  });

  casper.waitForSelectorTextChange('.hoodie-username',
    function waitForSignInTextSuccess() {
      casper.capture('./debug/signin-02-success.png');
      test.assertSelectorHasText('.hoodie-username', username);
    }, function waitForSignInTextError() {
      casper.capture('./debug/signin-02-fail.png');
      test.assertSelectorHasText('.hoodie-username', username);
  });
});
