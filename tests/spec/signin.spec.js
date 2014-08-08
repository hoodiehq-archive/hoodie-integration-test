/*global casper:false */
var hosts = require('../hosts.json');

casper.test.begin('SignIn test', function(test) {
  casper.start(hosts.www, function() {
    casper.viewport(1024, 768);
  });
  casper.then(function() {
    casper.capture('./debug/signin-01-pre.png');
  });

  require('../steps/signin')(test, {
    username: 'hoodieuser',
    password: 'hoodiepass'
  });

  casper.waitForText('Name or password is incorrect.',
    function waitForSignInErrorTextSuccess() {
      casper.capture('./debug/signin-02-success.png');
      test.assertTextExists('Name or password is incorrect.');
    }, function waitForSignInErrorTextError() {
      casper.capture('./debug/signin-02-fail.png');
      test.assertTextExists('Name or password is incorrect.');
  });

});
