var path = require('path');

var shell = require('shelljs');

var depPath = require('./util/dep-path');

module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  require('load-grunt-tasks')(grunt);

  var env = process.env;
  env.HOODIE_SETUP_PASSWORD = '12345';
  var ports = require('./ports');
  var appname = 'myapp';

  // Project configuration.
  grunt.initConfig({
    watch: {
      dev: {
        files: ['tests/**/*'],
        tasks: [
          'rm-data',
          'hoodie:start',
          'casper:watch',
          'hoodie:stop',
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    casper: {
      options: {
        test: true,
        pre: ['tests/pre-test.js'],
        post: ['tests/post-test.js'],
        'log-level': 'info',
      },
      dist: {
        src: ['tests/spec/**/*.spec.js']
      },
      watch: {
        src: ['tests/spec/**/*.spec.js'],
        options: {
          'fail-fast': true,
          concise: true
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
        command: './node_modules/.bin/hoodie new ' + appname
      }
    },

    replace: {
      injectBindShimIntoApp: {
        src: [
          appname + '/www/index.html',
          appname + '/node_modules/hoodie-server/node_modules/hoodie-admin-dashboard/www/index.html'
        ],
        overwrite: true,                 // overwrite matched source files
        replacements: [{
          from: '</head>',
          to: '<script>if(!Function.prototype.bind){Function.prototype.bind=function(e){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var t=Array.prototype.slice.call(arguments,1),n=this,r=function(){},i=function(){return n.apply(this instanceof r&&e?this:e,t.concat(Array.prototype.slice.call(arguments)))};r.prototype=this.prototype;i.prototype=new r;return i}}</script></head>'
        }]
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
  grunt.registerTask('dev', [
    'rm-app',
    'shell:createApp',
    'replace:injectBindShimIntoApp',
    'watch'
  ]);

  grunt.registerTask('test', function() {
    var module = this.args.join('');
    var tasksPre = ['shell:createApp', 'replace:injectBindShimIntoApp'];
    var tasksPost = ['hoodie:start', 'casper:dist', 'hoodie:stop'];

    if (!module) {
      return grunt.task.run(tasksPre.concat(tasksPost));
    }

    grunt.registerTask('deep-link', function() {
      var done = this.async();
      depPath(appname, module, function(depPath) {
        if (!depPath) {
          grunt.log.warn('Dependencies do not contain the module ' + module);
          return done();
        }

        shell.exec('npm link ' + module, {
          cwd: path.join(appname, depPath)
        });
        grunt.task.run(tasksPost);
        done();
      });
    });

    grunt.task.run(tasksPre.concat(['deep-link']));
  });

  grunt.registerTask('default', ['rm-app', 'test']);
};

