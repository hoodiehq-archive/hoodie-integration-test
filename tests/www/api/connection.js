/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // preparations for events testing
    .execute(function() {
      window.events = [];
      hoodie.on('disconnected', function() {
        window.events.push('disconnected');
      });
      hoodie.on('reconnected', function() {
        window.events.push('reconnected');
      });
    })

    // hoodie.checkConnection to resolve
    .executeAsync(function(callback) {
      return hoodie.checkConnection().done(callback);
    })

    // hoodie.isConnected to return true
    .execute(function() {
      return hoodie.isConnected();
    })
    .then(function(isConnected) {
      expect(isConnected).to.equal(true);
    })

    // when Hoodie Server cannot be reached,
    // - hoodie.checkConnection to reject
    // - 'disconnected' event to be triggered
    .executeAsync(function(callback) {
      hoodie.baseUrl = 'http://fail';
      return hoodie.checkConnection().fail(function() {
        callback(window.events);
      });
    })
    .then(function(events) {
      expect(events.length).to.equal(1);
      expect(events[0]).to.equal('disconnected');
    })

    // hoodie.isConnected to return false
    .execute(function() {
      return hoodie.isConnected();
    })
    .then(function(isConnected) {
      expect(isConnected).to.equal(false);
    })

    // when Hoodie Server can be reached again, resolve
    // - hoodie.checkConnection to resolve
    // - 'reconnected' event to be triggered
    .executeAsync(function(callback) {
      hoodie.baseUrl = '';
      return hoodie.checkConnection().done(function() {
        callback(window.events);
      });
    })
    .then(function(events) {
      expect(events.length).to.equal(2);
      expect(events[1]).to.equal('reconnected');
    })

    // hoodie.isConnected to return true
    .execute(function() {
      return hoodie.isConnected();
    })
    .then(function(isConnected) {
      expect(isConnected).to.equal(true);
    })

    ;
};
