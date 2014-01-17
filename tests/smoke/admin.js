/*global casper:false */

'use strict';

var ADMIN_URL  = 'http://127.0.0.1:6002/';

casper.test.comment('check hosts');

casper.start(ADMIN_URL, function(resp) {

  this.test.info('Current location is ' + this.getCurrentUrl());

  this.test.assert(resp.status === 200);
  this.test.assert(this.getCurrentUrl() === ADMIN_URL);
});

casper.thenOpen(ADMIN_URL + '_api', function (resp) {
  this.test.info('Current location is ' + this.getCurrentUrl());
  this.test.assert(resp.status === 200);
});

casper.run(function() {
  this.test.done();
});
