/* global hoodie */

module.exports = function(expect, hosts) {

  var username = 'remoteuser' + Date.now();
  var password = 'hoodiepassword';
  return this.remote
    .setExecuteAsyncTimeout(10000)

    // make sure we have a clean state
    .get(hosts.www)

    // not supported by Firefox it seams:
    // .clearLocalStorage()
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback, 1000);
    })

    // start
    .get(hosts.www)

    // preparations for events testing
    .execute(function() {
      window.accountEvents = [];

      [
        'signin',
        'signup',
        'signout',
        'changeusername',
        'changepassword',
        'passwordreset',
        'reauthenticated',
        'destroy',
        'error:unauthenticated',
        'error:passwordreset'
      ].forEach(function(eventName) {
        hoodie.account.on(eventName, function() {
          window.accountEvents.push(eventName);
        });
      });
    })

    // signin to fail with invalid username
    .executeAsync(function(callback) {
      return hoodie.account.signIn('foo', 'bar').fail(function (error) {
        // note: error instance gets turned into an object
        //       with same properties, so we stringify it
        callback(error.toString());
      });
    })
    .then(function(error) {
      expect(error).to.match(/^HoodieUnauthorizedError/);
      expect(error).to.match(/Name or password is incorrect.$/);
    })

    // signup to resolve with new username
    .executeAsync(function(username, password, callback) {
      hoodie.account.signUp(username, password)
      .done(callback);
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
    .then(function(_username) {
      expect(_username).to.equal(username + '2');
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
    .then(function(_username) {
      expect(_username).to.equal(username + '2');
    })

    .execute(function() {
      return window.accountEvents;
    })
    .then(function(events) {
      expect(events.length).to.equal(7);
      expect(events[0]).to.equal('signup');
      expect(events[1]).to.equal('changepassword');
      expect(events[2]).to.equal('changeusername');
      expect(events[3]).to.equal('signout');
      expect(events[4]).to.equal('signin');
      expect(events[5]).to.equal('signout');
      expect(events[6]).to.equal('destroy');
    })

    // reset events
    .execute(function() {
      window.accountEvents = [];
    })

    // test upgrade from anonymous account
    .executeAsync(function(callback) {
      hoodie.account.anonymousSignUp().done(callback);
    })
    .then(function(value) {
      expect(value).to.equal(null);
    })
    .executeAsync(function(username, password, callback) {
      hoodie.account.signUp(username, password).done(callback);
    }, [username, password])
    .then(function(_username) {
      expect(_username).to.equal(username);
    })

    // TODO: add test for https://github.com/hoodiehq/hoodie.js/issues/413

    // simulate unauthenticated state
    .executeAsync(function(callback) {
      hoodie.account.on('error:unauthenticated', callback);
      hoodie.account.bearerToken = undefined;
      hoodie.trigger('remote:error:unauthenticated');
    })

    .execute(function() {
      // sometimes there is an extra `error:unauthenticated`
      // see https://github.com/hoodiehq/hoodie.js/issues/370
      if (window.accountEvents.length === 3) {
        window.accountEvents.splice(2, 1);
      }

      return window.accountEvents;
    })
    .then(function(events) {
      expect(events.length).to.equal(2);
      expect(events[0]).to.equal('signup');
      expect(events[1]).to.equal('error:unauthenticated');
    })

    // simulate unauthenticated state
    .executeAsync(function(username, password, callback) {
      hoodie.account.signIn(username, password).done(function() {
        callback(window.accountEvents);
      });
    }, [username, password])

    .then(function(events) {
      expect(events.length).to.equal(3);
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
