/* global hoodie */

module.exports = function(expect, hosts, options) {

  var currentHoodieId;
  var accountHoodieId;
  var username = options.user.name + '-id-' + Date.now();
  var password = options.user.password;
  return this.remote

    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // hoodie.id() to return random id
    .execute(function() {
      return hoodie.id();
    })
    .then(function(id) {
      currentHoodieId = id;
      expect(id).to.match(/[a-z0-9]{7}/);
    })

    // hoodie.id() persists page reload
    .get(hosts.www)
    .execute(function() {
      return hoodie.id();
    })
    .then(function(id) {
      expect(id).to.equal(currentHoodieId);
    })

    // hoodie.id() to change when account destroyed
    .executeAsync(function(callback) {
      hoodie.account.destroy().done(function() {
        callback(hoodie.id());
      });
    })
    .then(function(id) {
      expect(id).not.to.equal(currentHoodieId);
      currentHoodieId = id;
    })

    // hoodie.id() not to change when signing up
    .executeAsync(function(username, password, callback) {
      hoodie.account.signUp(username, password).done(function() {
        callback(hoodie.id());
      });
    }, [username, password])
    .then(function(id) {
      expect(id).to.equal(currentHoodieId);
      accountHoodieId = currentHoodieId;
    })

    // hoodie.id() to change when signing out
    .executeAsync(function(callback) {
      hoodie.account.signOut().done(function() {
        callback(hoodie.id());
      });
    })
    .then(function(id) {
      expect(id).not.to.equal(currentHoodieId);
      currentHoodieId = id;
    })

    // hoodie.id() to change when signing out
    .executeAsync(function(callback) {
      hoodie.account.signOut().done(function() {
        callback(hoodie.id());
      });
    })
    .then(function(id) {
      expect(id).not.to.equal(currentHoodieId);
      currentHoodieId = id;
    })

    // hoodie.id() to be set to account's hoodieId
    .executeAsync(function(username, password, callback) {
      hoodie.account.signIn(username, password).done(function() {
        callback(hoodie.id());
      });
    }, [username, password])
    .then(function(id) {
      expect(id).to.equal(accountHoodieId);
      currentHoodieId = accountHoodieId;
    })

    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    });
};
