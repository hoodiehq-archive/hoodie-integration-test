/*global casper:false */

var hosts = require('../hosts.json');

casper.test.begin('SignUp test', function(test) {
  casper.start(hosts.www);
  casper.waitForSelector('.hoodie-account-signedout .btn.btn-small.btn-primary:nth-child(1)',
    function success() {
      test.assertExists('.hoodie-account-signedout .btn.btn-small.btn-primary:nth-child(1)');
      this.click('.hoodie-account-signedout .btn.btn-small.btn-primary:nth-child(1)');
    },
    function fail() {
      test.assertExists('.hoodie-account-signedout .btn.btn-small.btn-primary:nth-child(1)');
    });
  casper.waitForSelector('form input[name=\'username\']',
    function success() {
      test.assertExists('form input[name=\'username\']');
      this.click('form input[name=\'username\']');
    },
    function fail() {
      test.assertExists('form input[name=\'username\']');
    });
  casper.waitForSelector('input[name=\'username\']',
    function success() {
      this.sendKeys('input[name=\'username\']', 'hoodieuser');
    },
    function fail() {
      test.assertExists('input[name=\'username\']');
    });
  casper.waitForSelector('input[name=\'password\']',
    function success() {
      this.sendKeys('input[name=\'password\']', 'hoodiepass');
    },
    function fail() {
      test.assertExists('input[name=\'password\']');
    });
  casper.waitForSelector('input[name=\'password_confirmation\']',
    function success() {
      this.sendKeys('input[name=\'password_confirmation\']', 'hoodiepass');
    },
    function fail() {
      test.assertExists('input[name=\'password_confirmation\']');
    });
  casper.waitForSelector('.modal-footer .btn.btn-primary',
    function success() {
      this.sendKeys('.modal-footer .btn.btn-primary', '\r');
    },
    function fail() {
      test.assertExists('.modal-footer .btn.btn-primary');
    });
  casper.waitForSelector('form .modal-footer .btn.btn-primary',
    function success() {
      test.assertExists('form .modal-footer .btn.btn-primary');
      this.click('form .modal-footer .btn.btn-primary');
    },
    function fail() {
      test.assertExists('form .modal-footer .btn.btn-primary');
    });

  casper.run(function() {
    test.done();
  });
});
