/*global casper:false */

'use strict';

var ADMIN_URL  = 'http://127.0.0.1:6005/';

casper.test.comment('check hosts');

casper.start(ADMIN_URL, function() {

  this.test.info('Current location is ' + this.getCurrentUrl());

  this.test.assert(this.getCurrentUrl() === ADMIN_URL);
});

casper.run(function() {
  this.test.done();
});
