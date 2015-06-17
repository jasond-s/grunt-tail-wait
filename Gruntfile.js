/*
 * grunt-tail-wait
 * http://www.jasonds.co.uk/blog/grunt-tail-wait
 *
 * Copyright (c) 2015 Jason Dryhurst-Smith
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    tail_wait: {
      single_file_options: {
        timeout: 10000,
        fileName: path.join(__dirname + '/package.json'),
        regex: 'Dependencies',
        forceWatchFromBeginning: true,
        fromBeginning: true
      },
      multiple_file_options: {
        files: [{
            expand: true,
            cwd: './',
            src: [
              './**/*.json',
              '!./node_modules/**/*.json'
            ],
            dest: './',
            ext: '.json'
        }],
        options : {
          timeout: 10000,
          regex: 'Test',
          forceWatchFromBeginning: true,
          fromBeginning: true
        }
      },
      initial_file_options: {
        files: [{
            expand: true,
            cwd: './',
            src: [
              './**/*.someNonsense',
            ],
            dest: './',
            ext: '.someNonsense'
        }],
        options : {
          initialFile: path.join(__dirname + '/package.json'),
          timeout: 10000,
          regex: 'Dependencies',
          forceWatchFromBeginning: true,
          fromBeginning: true
        }
      },
      search_file_options: {
        files: [{
            expand: true,
            cwd: './',
            src: [
              './**/*.someNonsense',
            ],
            dest: './',
            ext: '.someNonsense'
        }],
        options : {
          timeout: 10000,
          regex: 'Dependencies'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'tail_wait', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
