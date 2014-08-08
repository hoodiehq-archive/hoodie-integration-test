/*global casper:false */

casper.test.comment('pre');
casper.on('remote.message', function(message) {
  console.log(message);
});
casper.on('page.error', function(message, trace) {
  console.log(message);
  console.log(trace);
});
casper.test.done();

