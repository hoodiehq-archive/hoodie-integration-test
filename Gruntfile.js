'use strict';

module.exports = function(grunt) {

  // load npm tasks
  grunt.loadNpmTasks('grunt-ghost');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ghost: {
      dist: {
        filesSrc: [
          'tests/smoke/*.js'
        ],
        options: {
          direct: true,
          logLevel: 'info',
          pre: ['tests/pre-test.js'],
          post: ['tests/post-test.js'],
          printCommand: true,
          printFilePaths: true
        }
      }
    }

  });

  // Default task(s).
  grunt.registerTask('default', ['ghost']);

};
