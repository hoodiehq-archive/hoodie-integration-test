var path = require('path');
var glob = require('glob').sync;

module.exports = function(expect, hosts) {
  var suites = {
    name: 'www'
  };

  var options = {
    adminPassword: '12345'
    user: {
      name: 'hoodieuser',
      password: 'hoodiepassword'
    }
  };

  glob(path.join(__dirname, '/**/*.js')).forEach(function(path) {
    if (/index.js$/.test(path)) {
      return;
    }
    var name = path.split('/');
    name = name[name.length-1].replace('.js', '');

    suites[name] = function() {
      return require(path)
        .bind(this, expect, hosts, options)
        .apply(this, arguments);
    };
  });

  return suites;
};
