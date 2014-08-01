module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  require('load-grunt-tasks')(grunt);

  var env = process.env;
  env.HOODIE_SETUP_PASSWORD = '12345';

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
          childProcessOptions: {
            cwd: process.cwd() + '/myapp',
            env: env
          },
          'custom-ports': '6001,6002,6003'
        }
      },
      stop: {}
    },

    shell: {
      'createApp': {
        command: [
          'rm -rf myapp',
          './node_modules/.bin/hoodie new myapp',
        ].join('&&')
      }
    },

    release: {
      options: {
        bump: {
          files: ['package.json'],
          commitFiles: ['package.json', 'CHANGELOG.md']
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['shell:createApp', 'hoodie:start', 'casper', 'hoodie:stop']);

};
