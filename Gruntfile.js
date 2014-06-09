/*
 * grunt-notify
 * https://github.com/dylang/grunt-notify
 *
 * Copyright (c) 2012 Dylan Greene
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    mochaTest: {
      notify: {
          src: 'test/**/*.test.js',
          options: {
              reporter: 'spec'
          }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tests/**/*'
      ]
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'test'
  ]);

};