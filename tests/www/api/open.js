/* global hoodie */

module.exports = function(expect, hosts, options) {

  var testDb = 'hoodie-open-' + Date.now();

  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(30000)

    // preparations
    .execute(function(testDb) {
      window.testDb = hoodie.open(testDb);
      window.events = [];

      [
        'connect',
        'disconnect',
        'bootstrap:start',
        'push',
        'error:unauthenticated',
        'error:server',
        'bootstrap:end',
        'bootstrap:error',
        'change',
        'add',
        'update',
        'remove'
      ].forEach(function(eventName) {
        window.testDb.on(eventName, function() {
          window.events.push({
            name: eventName,
            args: [].slice.call(arguments)
          });
        });
      });
    }, [testDb])

    // create the db to test with
    .executeAsync(function(testDb, adminPassword, callback) {
      $.ajax({
        type:'PUT',
        url: '/_api/' + testDb,
        headers: {
          Authorization: 'Basic ' + btoa('admin:'+adminPassword)
        },
        contentType: 'application/json'
      }).done(callback);
    }, [testDb, options.adminPassword])

    // make sure we are not signed in
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    })

    // db.findAll() to resolve with empty array
    .executeAsync(function(callback) {
      window.testDb.findAll().done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(0);
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(0);
    })


    // isConnected to return false per default
    .execute(function() {
      return window.testDb.isConnected();
    })
    .then(function(isConnected) {
      expect(isConnected).to.equal(false);
    })

    // FIXME: for events to be triggered, store must be connected
    //        https://github.com/hoodiehq/hoodie.js/issues/362
    .executeAsync(function(callback) {
      window.testDb.connect().done(callback);
    })

    // isConnected now to return true
    .execute(function() {
      return window.testDb.isConnected();
    })
    .then(function(isConnected) {
      expect(isConnected).to.equal(true);
    })

    // adding new object
    .executeAsync(function(callback) {
      window.testDb.add('test', {nr: 1})
      .done(function(object){
        // FIXME: object is wrong, see https://github.com/hoodiehq/hoodie.js/issues/361
        // window.lastObjectId = object.id;
        window.lastObjectId = object.id.split(/\//)[1];
      })
      .done(callback);
    })
    .then(function(object) {
      // FIXME: blocked by https://github.com/hoodiehq/hoodie.js/issues/361
      // expect(object.id).to.match(/^[a-z0-9]{7}$/);
      // expect(object.type).to.equal('test');
      // expect(object.nr).to.equal(1);
    })

    // find object
    .executeAsync(function(callback) {
      window.testDb.find('test', window.lastObjectId).done(callback);
    })
    .then(function(object) {
      expect(object.nr).to.equal(1);
    })

    // find non-existing object
    .executeAsync(function(callback) {
      window.testDb.find('test', 'unknownid').fail(callback);
    })
    .then(function(error) {
      expect(error.toString()).to.match(/HoodieNotFoundError/);
    })

    // update object
    .executeAsync(function(callback) {
      window.testDb.update('test', window.lastObjectId, {nr: 2}).done(callback);
    })
    .then(function(/*object*/) {
      // FIXME: blocked by https://github.com/hoodiehq/hoodie.js/issues/361
      // expect(object.nr).to.equal(2);
      // expect(object.createdAt).to.be.below(object.updatedAt);
    })

    // remove object
    .executeAsync(function(callback) {
      window.testDb.remove('test', window.lastObjectId).done(callback);
    })
    .then(function(/*object*/) {
      // FIXME: blocked by https://github.com/hoodiehq/hoodie.js/issues/361
      // expect(object.nr).to.equal(2);
      // expect(parseInt(object._rev, 10)).to.equal(3);
    })

    // disconnect to check if event gets triggered correctly
    .execute(function() {
      // FIXME: disconnect does not return a promise right now
      //        https://github.com/hoodiehq/hoodie.js/issues/363
      window.testDb.disconnect();
    })

    //
    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(10);

      expect(events[0].name).to.equal('connect');
      expect(events[1].name).to.equal('bootstrap:start');
      expect(events[2].name).to.equal('bootstrap:end');
      expect(events[3].name).to.equal('add');
      expect(events[4].name).to.equal('change');
      expect(events[5].name).to.equal('update');
      expect(events[6].name).to.equal('change');
      expect(events[7].name).to.equal('remove');
      expect(events[8].name).to.equal('change');
      expect(events[9].name).to.equal('disconnect');
    })


    // reset events
    .execute(function() {
      window.events = [];
    })

    // push
    .executeAsync(function(callback) {
      window.testDb.push([
        {type: 'test', id: 'a'},
        {type: 'test', id: 'b'},
        {type: 'test', id: 'c'}
      ]).done(callback);
    })

    // check for push events
    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(3);
      expect(events[0].name).to.equal('push');
      expect(events[1].name).to.equal('push');
      expect(events[2].name).to.equal('push');

      expect(events[0].args[0].id).to.equal('a');
      expect(events[1].args[0].id).to.equal('b');
      expect(events[2].args[0].id).to.equal('c');

      expect(events[0].args[0]._rev).to.match(/^1-\w+$/);
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });

    // TODO:
    // - sync()
    // - pull()
    // - check for events
    //   - 'error:unauthenticated'
    //   - 'error:server'
    //   - 'bootstrap:error'
    // - check for sync (create object trough CORS on different domain)
};
