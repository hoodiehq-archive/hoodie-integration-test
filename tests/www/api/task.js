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
    // .then(function(/*task*/) {
    //   expect(task.type).to.equal('test');
    // })

    // hoodie.task.start resolves with task object
    .executeAsync(function(callback) {
      hoodie.task.start('test', {id: 'a'}).done(callback);

      // simulate successful handling of task by worker
      setTimeout(function() {
        console.log(hoodie.id());
        hoodie.remote.update('$test', 'a', {_deleted: true, $processedAt: new Date()});
      }, 3000);
    })
    .then(function(task) {
      expect(task.type).to.equal('test');
      expect(task.id).to.equal('a');
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      // see FIXME above
      // expect(events.length).to.equal(6);
      // expect(events[0].name).to.equal('start');
      // expect(events[1].name).to.equal('change');
      // expect(events[2].name).to.equal('start');
      // expect(events[3].name).to.equal('change');
      // expect(events[4].name).to.equal('success');
      // expect(events[5].name).to.equal('change');

      expect(events.length).to.equal(4);
      expect(events[0].name).to.equal('start');
      expect(events[1].name).to.equal('change');
      expect(events[2].name).to.equal('success');
      expect(events[3].name).to.equal('change');
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
