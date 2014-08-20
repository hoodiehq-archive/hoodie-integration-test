module.exports = function(expect, hosts) {
  return this.remote
    .get(hosts.www)
    .getPageTitle()
    .then(function(title) {
      expect(title).to.equal('testtest');
    });
};
