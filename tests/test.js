define([
  'intern!object',
  'intern/chai!assert',
  'require',
  '../hosts.js'
], function (registerSuite, assert, require, hosts) {
  registerSuite({
    name: 'index',

    'greeting form': function () {
      return this.remote
        .get(require.toUrl(hosts.www))
        .setFindTimeout(5000)
        .findByCssSelector('body');
    }
  });
});
