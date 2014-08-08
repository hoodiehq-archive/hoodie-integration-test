/*global casper:false */

casper.options.viewportSize = {width: 1024, height: 768};
casper.test.comment('pre');
casper.on('remote.message', function(message) {
  console.log(message);
});
casper.on('page.error', function(message, trace) {
  console.log(message);
  console.log(trace);
});
casper.test.done();
