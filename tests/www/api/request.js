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
      return hoodie.request('GET', '/nothinghere')
      .fail(function(error) {
        // Because of some weirdness, but the error object
        // turns into a string when passed directly
        callback({
          name: error.name
        });
      });
    })
    .then(function(error) {
       expect(error.name).to.equal('HoodieNotFoundError');
    })

    // hoodie.request('GET', '/nothinghere') to fail with HoodieNotFoundError
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/nothinghere')
      .fail(function(error) {
        // Because of some weirdness, but the error object
        // turns into a string when passed directly
        callback({
          name: error.name
        });
      });
    })
    .then(function(error) {
      expect(error.name).to.equal('HoodieNotFoundError');
    })

    // hoodie.request('GET', '/_config') to fail with HoodieUnauthorizedError
    .executeAsync(function(callback) {
      return hoodie.request('GET', '/_config').fail(function(error) {
        // note: error instance gets turned into an object
        //       with same properties, so we stringify it
        callback(error.toString())
      });
    })
    .then(function(error) {
      expect(error).to.match(/HoodieUnauthorizedError/);
    })

    // hoodie.request('GET', 'http://fail/_config') to fail with HoodieConnectionError
    .executeAsync(function(callback) {
      return hoodie.request('GET', 'http://fail/_config').fail(function(error) {
        callback(error.toString())
      });
    })
    .then(function(error) {
      expect(error).to.match(/HoodieConnectionError/);
    })

    // hoodie.request('GET', '<path to CORS enabled endpoint') to resolve with response
    .executeAsync(function(callback) {
      var corsUrl = 'http://localhost:' + location.port;
      return hoodie.request('GET', corsUrl + '/_api').done(callback);
    })
    .then(function(response) {
      expect(typeof response).to.equal('object');
    })



    // cleanup
    .executeAsync(function(callback) {
      localStorage.clear();
      setTimeout(callback)
    });
};
