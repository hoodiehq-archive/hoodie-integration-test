/*global casper:false */

'use strict';

var COUCH_URL  = 'http://127.0.0.1:6003/';

casper.test.comment('check hosts');

casper.start(COUCH_URL, function(resp) {

  this.test.info('Current location is ' + this.getCurrentUrl());

  this.test.assert(resp.status === 200);
  this.test.assert(this.getCurrentUrl() === COUCH_URL);
});

casper.run(function() {
  this.test.done();
});
