/* global hoodie */

module.exports = function(expect, hosts/*, user*/) {

  var username = 'remoteuser' + Date.now();
  var password = 'hoodiepassword';
  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // preparations for events testing
    .execute(function() {
      window.events = [];

      [
        'signin',
        'signup',
        'signout',
        'changeusername',
        'changepassword',
        'passwordreset',
        'reauthenticated',
        'error:unauthenticated',
        'error:passwordreset'
      ].forEach(function(eventName) {
        hoodie.account.on(eventName, function() {
          window.events.push(eventName);
        });
      });
    })

    // signin to fail with invalid username
    .executeAsync(function(callback) {
      return hoodie.account.signIn('foo', 'bar').fail(callback);
    })
    .then(function(error) {
      expect(error.toString()).to.match(/^HoodieUnauthorizedError/);
      expect(error.toString()).to.match(/Name or password is incorrect.$/);
    })

    // signup to resolve with new username
    .executeAsync(function(username, password, callback) {
      hoodie.account.signUp(username, password).done(callback);
    }, [username, password])
    .then(function(_username) {
      expect(_username).to.equal(username);
    })

    // hoodie.account.username to be set
    .execute(function() {
      return hoodie.account.username;
    })
    .then(function(_username) {
      expect(_username).to.equal(username);
    })

    // change password resolves with no arguments
    .executeAsync(function(oldPassword, newPassword, callback) {
      hoodie.account.changePassword(oldPassword, newPassword).done(callback);
    }, [password, password + '2'])
    .then(function() {
      // FIXME: https://github.com/hoodiehq/hoodie.js/issues/364
      // expect(arguments.length).to.equal(0);
    })

    // change username resolves with new username
    .executeAsync(function(newUsername, password, callback) {
      hoodie.account.changeUsername(password, newUsername).done(callback);
    }, [username + '2', password + '2'])
    .then(function(newUsername) {
      expect(newUsername).to.equal(username + '2');
    })

    // hoodie.account.username to be changed
    .execute(function() {
      return hoodie.account.username;
    })
    .then(function(_username) {
      expect(_username).to.equal(username + '2');
    })

    // sign out resolves with username
    .executeAsync(function(callback) {
      hoodie.account.signOut().done(callback);
    })
    .then(function(/*_username*/) {
      // FIXME: https://github.com/hoodiehq/hoodie.js/issues/365
      // expect(_username).to.equal(username + '2');
    })

    // sign in resolves with username
    .executeAsync(function(username, password, callback) {
      hoodie.account.signIn(username, password).done(callback);
    },[username + '2', password + '2'])
    .then(function(_username) {
      expect(_username).to.equal(username + '2');
    })

    // destroy resolves with username
    .executeAsync(function(callback) {
      hoodie.account.destroy().done(callback);
    })
    .then(function(/*_username*/) {
      // FIXME: https://github.com/hoodiehq/hoodie.js/issues/366
      // expect(_username).to.equal(username + '2');
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(6);
      expect(events[0]).to.equal('signup');
      expect(events[1]).to.equal('changepassword');
      expect(events[2]).to.equal('changeusername');
      expect(events[3]).to.equal('signout');
      expect(events[4]).to.equal('signin');
      expect(events[5]).to.equal('signout');

      // FIXME: hoodie.account.destroy should also trigger 'destroy' event
      //        https://github.com/hoodiehq/hoodie.js/issues/367
    })

    // reset events
    .execute(function() {
      window.events = [];
    })

    // test upgrade from anonymous account
    .executeAsync(function(callback) {
      hoodie.account.anonymousSignUp().done(callback);
    })
    .then(function() {
      // FIXME: https://github.com/hoodiehq/hoodie.js/issues/368
      // expect(arguments.length).to.equal(0);
    })
    .executeAsync(function(username, password, callback) {
      hoodie.account.signUp(username, password).done(callback);
    }, [username, password])
    .then(function(_username) {
      expect(_username).to.equal(username);
    })

    // simulate unauthenticated state
    .executeAsync(function(callback) {
      $.ajax({type: 'DELETE', url: '/_api/_session'}).done(function() {
        hoodie.trigger('remote:error:unauthenticated');
        callback();
      });
    })

    .execute(function() {
      return window.events;
    })
    .then(function(events) {
      expect(events.length).to.equal(2);
      expect(events[0]).to.equal('signup');
      expect(events[1]).to.equal('error:unauthenticated');
    })

    // simulate unauthenticated state
    .executeAsync(function(username, password, callback) {
      hoodie.account.signIn(username, password).done(function() {
        callback(window.events);
      });
    }, [username, password])

    .then(function(events) {
      expect(events[2]).to.equal('reauthenticated');

      // FIXME: https://github.com/hoodiehq/hoodie.js/issues/369
      expect(events.length).to.equal(4); // 3
    });
};
