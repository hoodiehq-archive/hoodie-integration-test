/* global hoodie */

module.exports = function(expect, hosts/*, options*/) {
  var task1 = 'milk';
  var task2 = 'bread';
  var task3 = 'butter';
  var task4 = 'Nutella';
  var task5 = 'moar Nutella';

  var username = 'walktrough' + Date.now();
  var password = 'hoodiepassword';
  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(30000)
    .setFindTimeout(30000)

    // add tasks
    .findByCssSelector('#todoinput')
      .type(task1 + '\r')
      .type(task2 + '\r')
      .type(task3 + '\r')
    .end()

    // .execute(function() {
    //   $('body').css('background', '#d90');
    // })
    // .waitForConditionInBrowser('window.done === true', 1000000)

    // sign up
    .findByCssSelector('[data-hoodie-action=signup]')
      .click()
    .end()
    .findByName('username')
      .type(username)
    .end()
    .findByName('password')
      .type(password)
    .end()
    .findByName('password_confirmation')
      .type(password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign Up')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + username))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(username)
    .end()
    .getCookies()
    .then(function(cookies) {
      // we use bearer tokens, no cookies should be set
      expect(cookies.length).to.equal(0);
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
      expect(config['_account.username']).to.equal(username);
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
    .waitForConditionInBrowser('$("#todolist li").length === 0')

    // sign in
    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-toggle=dropdown]')
      .click()
    .end()

    .findByCssSelector('[data-hoodie-account-status=signedout] .hoodie-account-signedout [data-hoodie-action=signin]')
      .click()
    .end()

    .findByName('username')
      .type(username)
    .end()
    .findByName('password')
      .type(password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + username))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(username)
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
      .type(username)
    .end()
    .findByName('password')
      .type(password)
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + username))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(username)
    .end()

    // change password
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-toggle=dropdown]')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin [data-hoodie-action=changepassword]')
      .click()
    .end()
    .findByName('current_password')
      .type(password)
    .end()
    .findByName('new_password')
      .type(password + '2')
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

    .execute(function() {
      // speed up getting into unauthenticated state
      hoodie.trigger('remote:error:unauthenticated');
    })

    // reauthenticate
    .findByCssSelector('[data-hoodie-account-status=error] .hoodie-account-error [data-hoodie-action=signin]')
      .click()
    .end()
    .findByName('username')
      .type(username)
    .end()
    .findByName('password')
      .type(password + '2')
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Sign in')
      .click()
    .end()
    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + username))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(username)
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
      .type(password + '2')
    .end()
    .findByName('new_username')
      .type(username + '2')
    .end()
    .findByCssSelector('form > div > div.modal-footer > button')
      .getVisibleText()
      .should.become('Change Username')
      .click()
    .end()

    // should.eventually doesn't stop the intern here, dunno why, it works
    // the first time above.
    .waitForConditionInBrowser('hoodie.account.username === "'+username+'2"')

    .findByCssSelector('[data-hoodie-account-status=signedin] .hoodie-account-signedin')
      .getVisibleText()
      .should.eventually.match(new RegExp('Hello, ' + username + '2'))
    .end()
    .findByClassName('hoodie-username')
      .getVisibleText()
      .should.become(username + '2')
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
    //
    //       I also tried .waitForDeletedByCssSelector('#todolist li'), didn't work.
    .waitForConditionInBrowser('$("#todolist li").length === 0')
};
