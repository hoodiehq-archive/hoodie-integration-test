casper.test.comment('pre');
casper.test.done();

casper.on('page.error', function(msg, trace) {
  this.echo('Error: ' + msg, 'ERROR');
  for(var i=0; i<trace.length; i++) {
    var step = trace[i];
    this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
  }
});

