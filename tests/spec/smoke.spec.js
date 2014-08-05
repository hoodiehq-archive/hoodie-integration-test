/*global casper:false */

'use strict';

var hosts = require('../hosts.json');

casper.test.comment('check hosts');

Object.keys(hosts).forEach(function(hostname) {
  var host = hosts[hostname];

  casper.start(host, function(resp) {

    this.test.info('Current location is ' + this.getCurrentUrl());

    this.test.assert(resp.status === 200);
    this.test.assert(this.getCurrentUrl() === host);
  });

  casper.thenOpen(host + '_api', function (resp) {
    this.test.info('Current location is ' + this.getCurrentUrl());
    this.test.assert(resp.status === 200);
  });

  casper.run(function() {
    this.test.done();
  });

});
