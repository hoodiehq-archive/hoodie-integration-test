/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // clear local data
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback, 100);
    })

    // start
    .get(hosts.www)

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

    // store.add to resolve with created object
    .executeAsync(function(callback) {
      window.events = [];
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
    })

    // store.add accepts custom id
    .executeAsync(function(callback) {
      hoodie.store.add('test', {id: '123'}).done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('123');
    })

    // store.add fails if object exist
    // FIXME: https://github.com/hoodiehq/hoodie.js/issues/377
    // .executeAsync(function(callback) {
    //   hoodie.store.add('test', {id: '123'})//.fail(callback);
    //   .fail(function(error) {
    //     // no clue why, but the error object turns into a string
    //     // when passed directly?!
    //     callback({
    //       name: error.name
    //     })
    //   })
    // })
    // .then(function(error) {
    //   expect(error.name).to.equal('HoodieConflictError');
    // })

    // store.findOrAdd succeeds if object exist
    .executeAsync(function(callback) {
      hoodie.store.findOrAdd('test', '123', {}).done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('123');
    })

    // store.updateOrAdd updates existing object
    .executeAsync(function(callback) {
      hoodie.store.updateOrAdd('test', '123', {foo: 'bar'}).done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('123');
      expect(object.foo).to.equal('bar');
    })

    // store.find succeeds if object exists
    .executeAsync(function(callback) {
      hoodie.store.find('test', '123').done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('123');
    })

    // store.find fails if object exists
    .executeAsync(function(callback) {
      hoodie.store.find('test', 'nope').fail(callback);
    })
    .then(function(error) {
      // FIXME https://github.com/hoodiehq/hoodie.js/issues/378
      // expect(error.name).to.equal('HoodieNotFoundError');
      // expect(error.message).to.equal('"test" with id "nope" could not be found');
    })



    // store.findAll returns all objects
    // Scenario: empty store, then add one test objcet
    .executeAsync(function(callback) {
      hoodie.store.clear().done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.add('test', {foo: 'bar'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.add('note', {subject: 'my note'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.findAll().done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(2);
      expect(objects[0].subject).to.equal('my note');
      expect(objects[1].foo).to.equal('bar');
    })
    // store.findAll('nada') returns empty arry
    .executeAsync(function(callback) {
      hoodie.store.findAll('nada').done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(0);
    })
    // store.findAll('note') return [note] array
    .executeAsync(function(callback) {
      hoodie.store.findAll('note').done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(1);
    })


    // store.update succeeds if object exists
    .executeAsync(function(callback) {
      hoodie.store.add('test', {id: '123'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.update('test', '123', {foo: 'bar'}).done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('123');
      expect(object.foo).to.equal('bar');
    })

    // store.update fails if object exists
    .executeAsync(function(callback) {
      hoodie.store.find('test', 'nope').fail(callback);
    })
    .then(function(error) {
      // FIXME https://github.com/hoodiehq/hoodie.js/issues/378
      // expect(error.name).to.equal('HoodieNotFoundError');
      // expect(error.message).to.equal('"test" with id "nope" could not be found');
    })

    // FIXME:
    // store.updateAll returns all objects
    // Scenario: empty store, add test objects, update all & filtered by type
    // .executeAsync(function(callback) {
    //   hoodie.store.clear().done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('test', {foo: 'bar'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('note', {subject: 'my 1st note'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('note', {subject: 'my 2nd note'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.updateAll({isFunky: true}).done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(3);
    //   expect(objects[0].isFunky).to.equal(true);
    //   expect(objects[1].isFunky).to.equal(true);
    //   expect(objects[2].isFunky).to.equal(true);
    // })
    // // store.updateAll('nada', {isFunky: true}) suceeds with empty arry
    // .executeAsync(function(callback) {
    //   hoodie.store.updateAll('nada', {isFunky: true}).done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(0);
    // })
    // // store.updateAll('note', {isArchived: true}) return [note, note] array
    // .executeAsync(function(callback) {
    //   hoodie.store.updateAll('note', {isArchived: true}).done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(2);
    //   expect(objects[1].isArchived).to.equal(true);
    //   expect(objects[2].isArchived).to.equal(true);
    // })


    // store.find succeeds if object exists
    .executeAsync(function(callback) {
      hoodie.store.add('test', {id: 'removetest'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.remove('test', 'removetest').done(callback);
    })
    .then(function(object) {
      expect(object.id).to.equal('removetest');
    })

    // store.find fails if object exists
    .executeAsync(function(callback) {
      hoodie.store.remove('test', 'nope').fail(callback);
    })
    .then(function(error) {
      // FIXME https://github.com/hoodiehq/hoodie.js/issues/378
      // expect(error.name).to.equal('HoodieNotFoundError');
      // expect(error.message).to.equal('"test" with id "nope" could not be found');
    })


    // store.findAll returns all objects
    // Scenario: empty store, then add test objcets
    // FIXME: https://github.com/hoodiehq/hoodie.js/issues/380
    // .executeAsync(function(callback) {
    //   hoodie.store.clear().done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('test', {foo: 'bar'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('note', {subject: 'my 1st note'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('note', {subject: 'my 2nd note'}).done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.removeAll().done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(3);
    //   expect(objects[0]).to.equal('FUNK');
    //   expect(objects[0].subject).to.equal('my 2nd note');
    //   expect(objects[1].subject).to.equal('my 1st note');
    //   expect(objects[2].foo).to.equal('bar');
    // })
    // // store.removeAll('nada') suceeds with empty array
    // .executeAsync(function(callback) {
    //   hoodie.store.removeAll('nada').done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(0);
    // })
    // // store.removeAll('note') return [note, note] array
    // .executeAsync(function(callback) {
    //   hoodie.store.removeAll('note').done(callback);
    // })
    // .then(function(objects) {
    //   expect(objects.length).to.equal(2);
    //   expect(objects[0].subject).to.equal('my 2nd note');
    //   expect(objects[1].subject).to.equal('my 1st note');
    // })


    // store.changedObjects returns empty array if there are no objects
    .executeAsync(function(callback) {
      hoodie.store.clear().done(callback);
    })
    .execute(function() {
      return hoodie.store.changedObjects()
    })
    .then(function(objects) {
      expect(objects.length).to.equal(0);
    })
    // store.changedObjects returns all objects until user signed up
    .executeAsync(function(callback) {
      hoodie.store.add('test', {foo: 'bar1'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.add('test', {foo: 'bar2'}).done(callback);
    })
    .execute(function() {
      return hoodie.store.changedObjects()
    })
    .then(function(objects) {
      expect(objects.length).to.equal(2);
      expect(typeof objects[0].foo).to.equal('string');
    })
    // after user signed up, changed objects are empty
    .executeAsync(function(callback) {
      hoodie.account.signUp('changedObjectsTest' + Date.now(), 'secret').done(callback);
    })
    .waitForConditionInBrowser('hoodie.store.changedObjects().length === 0', 10000)
    // cleanup
    .executeAsync(function(callback) {
      hoodie.account.destroy().done(callback);
    })


    // store.hasLocalChanges returns false if there are no objects
    .executeAsync(function(callback) {
      hoodie.store.clear().done(callback);
    })
    .execute(function() {
      return hoodie.store.hasLocalChanges()
    })
    .then(function(hasChanges) {
      expect(hasChanges).to.equal(false);
    })
    // store.hasChanges returns true until user signs up
    .executeAsync(function(callback) {
      hoodie.store.add('test', {foo: 'bar1'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.add('test', {foo: 'bar2'}).done(callback);
    })
    .execute(function() {
      return hoodie.store.hasLocalChanges()
    })
    .then(function(hasChanges) {
      expect(hasChanges).to.equal(true);
    })
    // after user signed up & sync, store.hasLocalChanges() returns false
    .executeAsync(function(callback) {
      hoodie.account.signUp('hasLocalChangesTest' + Date.now(), 'secret').done(callback);
    })
    .waitForConditionInBrowser('hoodie.store.hasLocalChanges() === false', 10000)
    .executeAsync(function(callback) {
      hoodie.account.destroy().done(callback);
    })

    // store.clear() removes all local objects
    .executeAsync(function(callback) {
      hoodie.store.add('test', {}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.clear().done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.store.findAll('test').done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(0);
    })

    // store.isPersistent() usually returns true.
    // Exception is Safari Private mode, for example
    .execute(function() {
      return hoodie.store.isPersistent()
    })
    .then(function(isPersistent) {
      expect(isPersistent).to.equal(true);
    })

    // scoped store by type
    .executeAsync(function(callback) {
      hoodie.store.clear().done(callback);
      hoodie.testStore = hoodie.store('test');
    })
    .executeAsync(function(callback) {
      hoodie.store.add('nottest', {}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.testStore.add({foo: 'bar1', id: '123'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.testStore.add({foo: 'bar2'}).done(callback);
    })
    .executeAsync(function(callback) {
      hoodie.testStore.findAll().done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(2);
      expect(objects[1].id).to.equal('123');
      expect(objects[1].foo).to.equal('bar1');
    })
    // store.findAll('note') return [note] array
    .executeAsync(function(callback) {
      hoodie.testStore.find('123').done(callback);
    })
    .then(function(object) {
      expect(object.foo).to.equal('bar1');
    })
    .executeAsync(function(callback) {
      hoodie.testStore.update('123', {foo: 'lalala'}).done(callback);
    })
    .then(function(object) {
      expect(object.foo).to.equal('lalala');
    })
    .executeAsync(function(callback) {
      hoodie.testStore.remove('123').done(callback);
    })
    .then(function(object) {
      expect(object.foo).to.equal('lalala');
    })
    .executeAsync(function(callback) {
      hoodie.testStore.removeAll().done(callback);
    })
    .then(function(objects) {
      expect(objects.length).to.equal(1);
      // FIXME https://github.com/hoodiehq/hoodie.js/issues/380
      // expect(objects[0].foo).to.equal('bar2');
    })

    // scoped store by type & id
    // FIXME: https://github.com/hoodiehq/hoodie.js/issues/381
    // .executeAsync(function(callback) {
    //   hoodie.store.clear().done(callback);
    // })
    // .executeAsync(function(callback) {
    //   hoodie.store.add('test', {id: '123', foo: 'bar'}).done(callback);
    //   hoodie.test123Store = hoodie.store('test', '123');
    // })
    // .executeAsync(function(callback) {
    //   hoodie.testStore.find().done(callback);
    // })
    // .then(function(object) {
    //   expect(object.foo).to.equal('bar');
    // })
    // .executeAsync(function(callback) {
    //   hoodie.testStore.update({foo: 'lalala'}).done(callback);
    // })
    // .then(function(object) {
    //   expect(object.foo).to.equal('lalala');
    // })
    // .executeAsync(function(callback) {
    //   hoodie.testStore.remove().done(callback);
    // })
    // .then(function(object) {
    //   expect(object.foo).to.equal('lalala');
    // })


    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
