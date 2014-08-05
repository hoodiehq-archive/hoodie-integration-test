var shell = require('shelljs');

module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  require('load-grunt-tasks')(grunt);

  var env = process.env;
  env.HOODIE_SETUP_PASSWORD = '12345';
  var ports = require('./ports');

  // Project configuration.
  grunt.initConfig({
    watch: {
      dev: {
        files: ['tests/**/*'],
        tasks: [
          'rm-data',
          'hoodie:start',
          'casper',
          'hoodie:stop',
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    casper: {
      dist: {
        src: ['tests/spec/*.spec.js'],
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
          'custom-ports': [ports.www, ports.admin, ports.couch].join(','),
          callback: function(config) {
            var output = {};
            Object.keys(config.stack).forEach(function(type) {
              if (config.stack[type].port !== ports[type]) {
                grunt.fail.fatal('Hoodie not running on custom ports');
              }
              grunt.log.ok('Hoodie running on correct ' + type + ' port: ' + ports[type]);
              output[type] = 'http://' +
                config.stack[type].host +
                ':' +
                config.stack[type].port +
                '/';
            });
            require('fs').writeFileSync('./tests/hosts.json', JSON.stringify(output, null, 2));
            grunt.log.writeflags(ports, 'Hoodie running on correct ports');
          }
        }
      },
      stop: {}
    },

    shell: {
      createApp: {
        command: './node_modules/.bin/hoodie new myapp'
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

  grunt.registerTask('rm-app', function() {
    shell.rm('-rf', 'myapp');
  });

  grunt.registerTask('rm-data', function() {
    shell.rm('-rf', 'myapp/data');
  });

  // Default task(s).
  grunt.registerTask('test', [
    'shell:createApp',
    'hoodie:start',
    'casper',
    'hoodie:stop'
  ]);

  grunt.registerTask('dev', [
    'rm-app',
    'test',
    'watch'
  ]);

  grunt.registerTask('default', ['rm-app', 'test']);
};

