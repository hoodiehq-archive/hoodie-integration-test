 /*global casper:false */

module.exports = function(test) {
  casper.waitForSelector('input#todoinput',
    function success() {
      test.assertExists('input#todoinput');
      this.click('input#todoinput');
    },
    function fail() {
      test.assertExists('input#todoinput');
    }
  );
  casper.waitForSelector('input#todoinput',
    function success() {
      this.sendKeys('input#todoinput', 'task title\ranother task title');
    },
    function fail() {
      test.assertExists('input#todoinput');
    }
   );
};
