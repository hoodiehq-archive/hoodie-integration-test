/*global casper:false */

module.exports = function(test) {
  casper.waitForSelector('.hoodie-account-signedin .btn.btn-small.btn-primary:nth-child(1)',
  function success() {
    test.assertExists('.hoodie-account-signedin .btn.btn-small.btn-primary:nth-child(1)');
    this.click('.hoodie-account-signedin .btn.btn-small.btn-primary:nth-child(1)');
  },
  function fail() {
    test.assertExists('.hoodie-account-signedin .btn.btn-small.btn-primary:nth-child(1)');
  });
};
