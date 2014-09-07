module.exports = function(expect, hosts) {
  return this.remote
    .get(hosts.admin)
    .getPageTitle()
    .should.become('Admin Dashboard');
};
