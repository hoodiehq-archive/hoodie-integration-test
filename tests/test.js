define([
  'intern!object',
  'intern/chai!expect',
  'intern/dojo/node!../hosts.json',
  'intern/dojo/node!./www'
], function (registerSuite, expect, hosts, www) {
  registerSuite(www(expect, hosts));
});
