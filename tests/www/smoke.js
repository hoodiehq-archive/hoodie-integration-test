module.exports = function(expect, hosts) {
  return this.remote
    .get(hosts.www)
    .getPageTitle()
    .should.become('testtest');
};
