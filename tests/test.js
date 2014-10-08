define([
  'intern!object',
  'intern/chai!',
  'intern/dojo/node!chai-as-promised',
  'intern/chai!expect',
  'intern/dojo/node!../hosts.json',
  'intern/dojo/node!./www',
  'intern/dojo/node!./admin'
], function (registerSuite, chai, chaiAsPromised, expect, hosts, www, admin) {
  chai.use(chaiAsPromised);
  chai.should();
  registerSuite(www(expect, hosts));
  registerSuite(admin(expect, hosts));
});
