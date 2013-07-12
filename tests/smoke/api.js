/*global casper:false */

'use strict';

var API_URL  = 'http://127.0.0.1:6001/';

casper.test.comment('check hosts');

casper.start(API_URL, function(resp) {

  this.test.info('Current location is ' + this.getCurrentUrl());

  this.test.assert(resp.status === 200);
  this.test.assert(this.getCurrentUrl() === API_URL);
});

casper.run(function() {
  this.test.done();
});
