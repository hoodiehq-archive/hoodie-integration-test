/*global casper:false */

module.exports = function(test, options) {
  casper.waitForSelector({
    type: 'xpath',
    path: '//a[normalize-space(text())=\'Sign In\']'
  },
  function success() {
    test.assertExists({
      type: 'xpath',
      path: '//a[normalize-space(text())=\'Sign In\']'
    });
    this.click({
      type: 'xpath',
      path: '//a[normalize-space(text())=\'Sign In\']'
    });
  },
  function fail() {
    test.assertExists({
      type: 'xpath',
      path: '//a[normalize-space(text())=\'Sign In\']'
    });
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
    this.sendKeys('input[name=\'username\']', options.username);
  },
  function fail() {
    test.assertExists('input[name=\'username\']');
  });
  casper.waitForSelector('input[name=\'password\']',
  function success() {
    this.sendKeys('input[name=\'password\']', options.password);
  },
  function fail() {
    test.assertExists('input[name=\'password\']');
  });
  casper.wait(1000);
  casper.waitForSelector('form .modal-footer .btn.btn-primary',
  function success() {
    test.assertExists('form .modal-footer .btn.btn-primary');
    this.click('form .modal-footer .btn.btn-primary');
    casper.capture('./debug/signin-03-wtf.png');
  },
  function fail() {
    test.assertExists('form .modal-footer .btn.btn-primary');
  });

};
