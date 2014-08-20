/* global hoodie */
module.exports = function(expect, hosts, user) {
  var task1 = 'milk';
  var task2 = 'bread';
  var task3 = 'butter';

  return this.remote
    .get(hosts.www)
    .setFindTimeout(10000)

    // add tasks
    .findByCssSelector('#todoinput')
      .type(task1 + '\r')
      .type(task2 + '\r')
      .type(task3 + '\r')
    .end()

    // sign up
    .findByCssSelector('[data-hoodie-action=signup]')
      .click()
    .end()
    .findByName('username')
      .type(user.name)
    .end()
    .findByName('password')
      .type(user.password)
    .end()
    .findByName('password_confirmation')
      .type(user.password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.equal('Sign Up');
      })
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.match(new RegExp('Hello, ' + user.name));
      })
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.equal(user.name);
      })
    .end()
    .getCookies()
    .then(function(cookies) {
      expect(cookies[0].name).to.equal('AuthSession');
    })
    .execute(function() {
      return {
        id: hoodie.id(),
        config: localStorage.getItem('_hoodie_config')
      };
    })
    .then(function(data) {
      var config = JSON.parse(data.config);
      expect(data.id).to.equal(config._hoodieId);
      expect(config['_account.username']).to.equal('hoodieuser');
    })

    // sign out
    .findByCssSelector('[data-hoodie-account-status=signedin] [data-hoodie-action=signout]')
      .click()
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.equal('');
      })
    .end()
    .execute(function() {
      return JSON.stringify(localStorage);
    })
    .then(function(data) {
      expect(data).to.equal('{"_hoodie_config":"{}"}');
    })

    // check that tasks have been removed
    .findAllByCssSelector('#todolist li label')
      .getVisibleText()
      .then(function(labels) {
        expect(labels.length).to.equal(0);
      })
    .end()

    // sign in
    .findByCssSelector('[data-hoodie-account-status=signedout] [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedout] [data-hoodie-action=signin]')
      .click()
    .end()
    .findByName('username')
      .type(user.name)
    .end()
    .findByName('password')
      .type(user.password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.equal('Sign in');
      })
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.match(new RegExp('Hello, ' + user.name));
      })
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .then(function(label) {
        expect(label).to.equal(user.name);
      })
    .end()

    // check that tasks have been added again
    .findAllByCssSelector('#todolist li label')
      .getVisibleText()
      .then(function(labels) {
        expect(labels.join(',')).to.equal([task1, task2, task3].join(','));
      })
    .end();
};
