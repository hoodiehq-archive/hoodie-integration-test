module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    casper: {
      dist: {
        src: ['tests/smoke/*.js'],
        options: {
          test: true,
          pre: ['tests/pre-test.js'],
          post: ['tests/post-test.js'],
          'log-level': 'info',

        }
      }
    },

    hoodie: {
      start: {
        options: {
          cwd: 'myapp'
        }
      },
      stop: {}
    },

    shell: {
      'createApp': {
        command: [
          'rm -rf myapp',
          './node_modules/hoodie-cli/bin/hoodie new myapp',
        ].join('&&')
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['shell:createApp', 'hoodie:start', 'casper', 'hoodie:stop']);

};
