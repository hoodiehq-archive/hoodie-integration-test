module.exports = function(grunt) {
  'use strict';

  // load npm tasks
  grunt.loadNpmTasks('grunt-casper');

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
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['casper']);

};
