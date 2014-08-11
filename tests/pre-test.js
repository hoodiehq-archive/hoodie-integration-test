/*global casper:false */

casper.options.viewportSize = {width: 1024, height: 768};
casper.test.comment('pre');
casper.on('remote.message', function(message) {
  console.log('CONSOLE', message);
});
casper.on('remote.alert', function(message) {
  console.log('ALERT', message);
});
casper.on('page.error', function(message, trace) {
  console.log(message);
  console.log(trace);
});
casper.test.done();
