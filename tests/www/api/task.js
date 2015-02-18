/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .setExecuteAsyncTimeout(10000)

    // start
    .get(hosts.www)

    // not supported by Firefox it seams:
    // .clearLocalStorage()
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback, 1000);
    })

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
    .executeAsync(function(callback) {
      hoodie.task.start('test', {nr: 1}).progress(callback);
    })
    .then(function(task) {
      expect(task.type).to.equal('test');
    })

    // hoodie.task.start resolves with task object if it succeeds
    .executeAsync(function(callback) {
      hoodie.task.start('test', {foo: 'bar1'})
      .done(callback)
      .fail(function(error) {
        throw error;
      })
    })
    .then(function(task) {
      expect(task.foo).to.equal('bar1');
    })
    .executeAsync(function(callback) {
      hoodie.task.start('test', {foo: 'bar2', fail: true})
      .fail(function(error) {
        // Because of some weirdness, but the error object
        // turns into a string when passed directly
        callback({
          message: error.message,
          name: error.name
        });
      });
    })
    .then(function(error) {
      expect(error.name).to.equal('HoodieError');
      expect(error.message).to.equal('Test failed errored intentionally.');
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(12);
      expect(events[0].name).to.equal('start');
      expect(events[1].name).to.equal('change');
      expect(events[2].name).to.equal('success');
      expect(events[3].name).to.equal('change');
      expect(events[4].name).to.equal('start');
      expect(events[5].name).to.equal('change');
      expect(events[6].name).to.equal('success');
      expect(events[7].name).to.equal('change');
      expect(events[8].name).to.equal('start');
      expect(events[9].name).to.equal('change');
      expect(events[10].name).to.equal('error');
      expect(events[11].name).to.equal('change');
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
