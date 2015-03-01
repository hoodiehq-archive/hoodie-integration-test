var path = require('path');

var cp = require('child_process');
var shell = require('shelljs');

var depPath = require('./util/dep-path');

module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('intern');

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
          'intern:tests',
          'hoodie:stop',
        ]
      },
      gruntfile: {
        files: ['Gruntfile.js']
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
            var fs = require('fs');
            fs.writeFileSync('./hosts.json', JSON.stringify(output, null, 2));
            grunt.log.writeflags(ports, 'Hoodie running on correct ports');
          }
        }
      },
      stop: {}
    },

    shell: {
      options: {
        execOptions: {
          // https://www.npmjs.com/package/grunt-shell#execoptions
          maxBuffer: 400*1024
        }
      },
      createApp: {
        command: './node_modules/.bin/hoodie new ' + appname
      },
      installTestPlugin: {
        command: 'cd ' + appname + ' && ./../node_modules/.bin/hoodie install test && cd -'
      }
    },

    intern: {
      options: {
        config: 'intern.js',
        runType: 'runner'
      },
      tests: {}
    }
  });

  grunt.registerTask('install-selenium', function() {
    shell.exec('sh util/install-selenium.sh');
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
    'shell:installTestPlugin',
    'watch'
  ]);

  grunt.registerTask('test', function() {
    var module = this.args.join('');
    var tasksPre = ['shell:createApp', 'shell:installTestPlugin'];
    var tasksPost = ['hoodie:start', 'intern:tests', 'hoodie:stop', 'rm-app'];

    if (process.env.CI) {
      tasksPre.push('install-selenium');
    }

    if (!module) {
      return grunt.task.run(tasksPre.concat(tasksPost));
    }

    grunt.registerTask('deep-link', function() {
      var done = this.async();
      var modulePath = depPath.dependenciesMap[module];

      if (!modulePath) {
        grunt.log.warn('Dependencies do not contain the module ' + module);
        return done();
      }

      cp.exec('npm link ' + module, {
        cwd: path.resolve(path.join(appname, modulePath)),
        maxBuffer: 400*1024
      }, function(err, stdout, stderr) {
        if (err) {
          console.log('execution error: ', err);
        }
        console.log(stdout);
        console.log(stderr);
        grunt.task.run(tasksPost);
        done();
      });

      // see https://github.com/hoodiehq/hoodie-integration-test/issues/19
      // depPath(appname, module, function(depPath) {
      //   if (!depPath) {
      //     grunt.log.warn('Dependencies do not contain the module ' + module);
      //     return done();
      //   }

      //   cp.exec('npm link ' + module, {
      //     cwd: path.resolve(path.join(appname, depPath)),
      //     maxBuffer: 400*1024
      //   }, function(err, stdout, stderr) {
      //     if (err) {
      //       console.log('execution error: ', err);
      //     }
      //     console.log(stdout);
      //     console.log(stderr);
      //     grunt.task.run(tasksPost);
      //     done();
      //   });
      // });
    });

    grunt.task.run(tasksPre.concat(['deep-link']));
  });

  grunt.registerTask('default', ['rm-app', 'test']);
};

