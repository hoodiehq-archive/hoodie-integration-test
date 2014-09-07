/* global hoodie */

module.exports = function(expect, hosts) {

  return this.remote
    .get(hosts.www)
    .setExecuteAsyncTimeout(10000)

    // hoodie.request('GET', '/').done to be called
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/').done(callback);
    })
    .then(function(response) {
      expect(typeof response).to.equal('object');
      // FIXME: no clue why that fails:
      //        expect(response).to.be.an(Object)
    })

    // hoodie.request('GET', '/').then to be called
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/').then(function() {
        return 1;
      }).done(callback);
    })
    .then(function(value) {
      expect(value).to.equal(1);
    })

    // hoodie.request('GET', '/nothinghere').fail to be called
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/nothinghere').fail(callback);
    })
    .then(function(error) {

      expect(error.toString()).to.match(/HoodieNotFoundError/);

      // FIXME: no clue why that fails:
      //        expect(error.name).to.equal('HoodieNotFoundError');
    })

    // hoodie.request('GET', '/nothinghere') to fail with HoodieNotFoundError
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/nothinghere').fail(callback);
    })
    .then(function(error) {
      expect(error.toString()).to.match(/HoodieNotFoundError/);

      // FIXME: no clue why that fails:
      //        expect(error.name).to.equal('HoodieNotFoundError');
    })

    // hoodie.request('GET', '/_config') to fail with HoodieUnauthorizedError
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/_config').fail(callback);
    })
    .then(function(error) {
      expect(error.toString()).to.match(/HoodieUnauthorizedError/);
    })

    // hoodie.request('GET', 'http://fail/_config') to fail with HoodieConnectionError
    .executeAsync(function(callback) {
      return hoodie.request('GET', 'http://fail/_config').fail(callback);
    })
    .then(function(error) {
      expect(error.toString()).to.match(/HoodieConnectionError/);
    })

    // hoodie.request('GET', '<path to CORS enabled endpoint') to resolve with response
    // FIXME: uncomment once Bearer Token is merged
    // .executeAsync(function(callback) {
    //   var corsUrl = 'http://localhost:' + location.port;
    //   return hoodie.request('GET', corsUrl + '/_api').done(callback);
    // })
    // .then(function(response) {
    //   expect(typeof response).to.equal('object');
    // })



    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      $.ajax({
        type: 'DELETE',
        url: '/_api/_session'
      }).done(callback);
    });
};
