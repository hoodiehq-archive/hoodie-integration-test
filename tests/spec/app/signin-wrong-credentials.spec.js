/*global casper:false */
var hosts = require('../../hosts.json');

casper.test.begin('SignIn with wrong credentials test', function(test) {
  casper.start(hosts.www);

  require('../../steps/app/signin')(test, {
    username: 'foo',
    password: 'bar'
  });

  casper.waitForText('Name or password is incorrect.',
    function waitForSignInErrorTextSuccess() {
      test.assertTextExists('Name or password is incorrect.');
    }, function waitForSignInErrorTextError() {
      test.assertTextExists('Name or password is incorrect.');
  });

});
