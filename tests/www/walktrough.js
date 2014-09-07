/* global hoodie */

module.exports = function(expect, hosts, options) {
  var task1 = 'milk';
  var task2 = 'bread';
  var task3 = 'butter';
  var task4 = 'Nutella';
  var task5 = 'moar Nutella';

  return this.remote
    // make sure we have a clean state
    .get(hosts.www)
    .clearCookies()
    // not supported by Firefox it seams:
    // .clearLocalStorage()
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback);
    })

    // start
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
      .type(options.user.name)
    .end()
    .findByName('password')
      .type(options.user.password)
    .end()
    .findByName('password_confirmation')
      .type(options.user.password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign Up')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + options.user.name))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(options.user.name)
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
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=signout]')
      .click()
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become('')
    .end()
    .execute(function() {
      return JSON.stringify(localStorage);
    })
    .should.become('{"_hoodie_config":"{}"}')

    // check that tasks have been removed
    .findAllByCssSelector('#todolist li label')
      .getVisibleText()
      .then(function(labels) {
        expect(labels.length).to.equal(0);
      })
    .end()

    // sign in
    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-hoodie-action=signin]')
      .click()
    .end()
    .findByName('username')
      .type(options.user.name)
    .end()
    .findByName('password')
      .type(options.user.password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + options.user.name))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(options.user.name)
    .end()

    // check that tasks have been added again
    .findAllByCssSelector('#todolist li label')
      .getVisibleText()
      .then(function(labels) {
        expect(labels.join(',')).to.equal([task1, task2, task3].join(','));
      })
    .end()

    // sign in on different URL
    .get(hosts.www.replace(/127.0.0.1/, 'localhost'))
    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-hoodie-action=signin]')
      .click()
    .end()
    .findByName('username')
      .type(options.user.name)
    .end()
    .findByName('password')
      .type(options.user.password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + options.user.name))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(options.user.name)
    .end()

    // change password
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=changepassword]')
      .click()
    .end()
    .findByName('current_password')
      .type(options.user.password)
    .end()
    .findByName('new_password')
      .type(options.user.password + '2')
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Change Password')
      .click()
    .end()

    // add another task
    .findByCssSelector('#todoinput')
      .type(task4 + '\r')
    .end()

    // sign out
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=signout]')
      .click()
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become('')
    .end()

    // go back to first URL, user is not in an unauthenticated state
    .get(hosts.www)

    // add another task
    .findByCssSelector('#todoinput')
      .type(task5 + '\r')
    .end()

    // reauthenticate
    .findByCssSelector('[data-hoodie-account-status=error] .hoodie-account-error [data-hoodie-action=signin]')
      .click()
    .end()
    .findByName('username')
      .type(options.user.name)
    .end()
    .findByName('password')
      .type(options.user.password + '2')
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + options.user.name))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(options.user.name)
    .end()

    // check that all tasks have been added
    .findAllByCssSelector('#todolist li label')
      .getVisibleText()
      .then(function(labels) {
        expect(labels.join(',')).to.equal([task1, task2, task3, task4, task5].join(','));
      })
    .end()

    // change username
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=changeusername]')
      .click()
    .end()
    .findByName('current_password')
      .type(options.user.password + '2')
    .end()
    .findByName('new_username')
      .type(options.user.name + '2')
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Change Username')
      .click()
    .end()

    // should.eventually doesn't stop the intern here, dunno why, it works
    // the first time above.
    .waitForConditionInBrowser('hoodie.account.username === "hoodieuser2"')

    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + options.user.name + '2'))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(options.user.name + '2')
    .end()

    // destroy account
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=destroy]')
      .click()
    .end()
    .acceptAlert()
    .findByClassName('hoodie-username')
      .isDisplayed()
      .should.eventually.become(false)
    .end()

    // check that all tasks have been removed
    // NOTE: we can't use findAllByCssSelector or similar methods, as they
    //       wait until they find a matching selector and eventually timeout
    //       instead of returning an empty array. There must be a more elegant
    //       way to do that, please let me know ~@gr2m
    .execute(function() {
      return $('#todolist li label').length;
    })
    .then(function(length) {
      expect(length).to.equal(0);
    });
};
