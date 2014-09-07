/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // prepare events tracking
    .execute(function() {
      window.events = [];

      [
        'change',
        'add',
        'update',
        'remove',
        'clear'
      ].forEach(function(eventName) {
        hoodie.store.on(eventName, function() {
          window.events.push({
            name: eventName,
            args: [].slice.call(arguments)
          });
        });
      });
    })

    // db.findAll() to resolve with empty array
    .executeAsync(function(callback) {
      hoodie.store.add('test', {nr: 1}).done(callback);
    })
    .then(function(object) {
      expect(object.id).to.match(/^[a-z0-9]{7}$/);
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(2);
      expect(events[0].name).to.equal('add');
      expect(events[1].name).to.equal('change');

      expect(events[0].args[0].nr).to.equal(1);
    });
};
