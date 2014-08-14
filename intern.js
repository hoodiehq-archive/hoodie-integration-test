define({
  proxyPort: 9000,
  proxyUrl: 'http://localhost:9000/',

  capabilities: {
    'selenium-version': '2.41.0'
  },

  environments: [{
    browserName: 'firefox'
  }],

  useLoader: {
    'host-node': 'dojo/dojo',
    'host-browser': 'node_modules/dojo/dojo.js'
  },

  functionalSuites: [ 'tests/test.js'],

  excludeInstrumentation: /^(?:tests|node_modules)\//
});
