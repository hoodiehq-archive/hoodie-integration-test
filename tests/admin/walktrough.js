module.exports = function(expect, hosts, options) {
  return this.remote

    // start
    .get(hosts.admin)
    .setFindTimeout(10000)

    // sign in
    .findByName('password')
      .type(options.adminPassword)
    .end()
    .findByCssSelector('[data-component=login] button[type=submit]')
      .getVisibleText()
      .should.become('Sign In')
      .click()
    .end()

    // app config is open in iframe, switch to it
    .switchToFrame(0)
    .findByName('appName')
      .clearValue()
      .type('CIApp')
    .end()
    .findByCssSelector('#appInfoForm button[type=submit]')
      .click()
    .end()

    // go back to main frame
    .switchToFrame(null)
    .findByCssSelector('[data-component=contentHeader] .signOut')
      .getVisibleText()
      .should.become('SIGN OUT')
      .click()
    .end()
    .waitForConditionInBrowser('$("#content").data("state") === "signed-out"');
};
