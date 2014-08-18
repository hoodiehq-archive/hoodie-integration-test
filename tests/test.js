define([
  'intern!object',
  'intern/chai!expect',
  'require',
  '../hosts.js'
], function (registerSuite, expect, require, hosts) {
  registerSuite({
    name: 'www',

    'smoke': function() {
      return this.remote
        .get(hosts.www)
        .getPageTitle()
        .then(function(title) {
          expect(title).to.equal('testtest');
        });
    },

    'signup': function() {
      return this.remote
        .get(hosts.www)
        .findByCssSelector('.hoodie-account-signedout button')
          .click()
        .end()
        .setFindTimeout(1e4)
        .findByName('username')
          .type('hoodieuser')
        .end()
        .findByName('password')
          .type('hoodiepassword')
        .end()
        .findByName('password_confirmation')
          .type('hoodiepassword')
        .end()
        .findByCssSelector('form > div > div.modal-footer > button')
          .getVisibleText()
          .then(function(label) {
            expect(label).to.equal('Sign Up');
          })
          .click()
        .end()
        .setFindTimeout(1e4)
        .findByClassName('hoodie-account-signedin')
          .getVisibleText()
          .then(function(label) {
            expect(label).to.match(/^Hello, /);
          })
        .end()
        .findByClassName('hoodie-username')
          .getVisibleText()
          .then(function(label) {
            expect(label).to.equal('hoodieuser');
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
        });
    }
  });
});
