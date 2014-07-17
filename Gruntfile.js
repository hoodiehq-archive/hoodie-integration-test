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
          }
        }
      },
      stop: {}
    },

    shell: {
      'createApp': {
        command: [
          './node_modules/hoodie-cli/bin/hoodie cache clean',
          'rm -rf myapp',
          './node_modules/hoodie-cli/bin/hoodie new myapp',
        ].join('&&')
      }
    },

    release: {
      options: {
        bump: {
          files: ['package.json'],
          commitFiles: ['package.json', 'CHANGELOG.md']
        },
        tasks: ['changelog']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['shell:createApp', 'hoodie:start', 'casper', 'hoodie:stop']);

};
