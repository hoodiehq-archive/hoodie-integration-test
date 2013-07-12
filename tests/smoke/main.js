/*global casper:false */

'use strict';

var MAIN_URL= 'http://127.0.0.1:6001/';

casper.test.comment('check hosts');

casper.start(MAIN_URL, function(resp) {

  this.test.info('Current location is ' + this.getCurrentUrl());

  this.test.assert(resp.status === 200);
  this.test.assert(this.getCurrentUrl() === MAIN_URL);
});

casper.run(function() {
  this.test.done();
});
