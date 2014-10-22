/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .setExecuteAsyncTimeout(10000)

    // start
    .get(hosts.www)

    // prepare events tracking
    .execute(function() {
      window.events = [];

      [
        'start',
        'abort',
        'success',
        'change',
        'error'
      ].forEach(function(eventName) {
        hoodie.task.on(eventName, function() {
          window.events.push({
            name: eventName,
            args: [].slice.call(arguments)
          });
        });
      });
    })

    // hoodie.task.start progresses with task object
    // FIXME: currently blocked by https://github.com/hoodiehq/hoodie.js/issues/372#issuecomment-54980005
    // .executeAsync(function(callback) {
    //   hoodie.task.start('test', {nr: 1}).progress(callback);
    // })
    // .then(function(task) {
    //   expect(task.type).to.equal('test');
    // })

    // hoodie.task.start resolves with task object if it succeeds
    .executeAsync(function(callback) {
      hoodie.task.start('test', {foo: 'bar1'}).done(callback);
    })
    .then(function(task) {
      expect(task.foo).to.equal('bar1');
    })
    .executeAsync(function(callback) {
      hoodie.task.start('test', {foo: 'bar2', fail: true}).fail(callback);
    })
    .then(function(error) {
      // FIXME https://github.com/hoodiehq/hoodie.js/issues/378
      // expect(error.name).to.equal('TestError');
      // expect(error.message).to.equal('Test failed errored intentionally.');
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(8);
      expect(events[0].name).to.equal('start');
      expect(events[1].name).to.equal('change');
      expect(events[2].name).to.equal('success');
      expect(events[3].name).to.equal('change');
      expect(events[4].name).to.equal('start');
      expect(events[5].name).to.equal('change');
      expect(events[6].name).to.equal('error');
      expect(events[7].name).to.equal('change');
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
