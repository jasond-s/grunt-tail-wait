/*
 * grunt-tail-wait
 * http://www.jasonds.co.uk/blog/grunt-tail-wait
 *
 * Copyright (c) 2015 Jason Dryhurst-Smith
 * Licensed under the MIT license.
 */

'use strict';

// External dependencies.
var Tail = require('tail').Tail;
var fs = require('fs');

// Export the gun task function for this module
module.exports = function (grunt) {

  // Register the task with grunt when loaded.
  grunt.registerMultiTask('tail_wait', 'Allows grunt to tail a file and wait for a speciic line', function () {

    // Make our task async.
    var done = this.async();

    // Populate some options and fail is required options are not present.
    var options = {

      // Required props.
      fileName: this.data.fileName,
      regex: this.data.regex,

      // Not required props, have defaults.
      lineSeparator: this.data.lineSeparator || "\n",
      timeout: this.data.timeout || 30000,
      fromBeginning: this.data.fromBeginning || false,

      // This is only needed if the file watched has been
      // completed before the start of this task.
      forceWatchFromBeginning: this.data.forceWatchFromBeginning || false

    };

    // The regular expression we want to check for.
    var regex = new RegExp(options.regex, 'g');

    // The length of time we will wait for our result.
    var timeout = options.timeout;

    // The timer used to cancel and move on if tail fails.
    var timer = null;

    // An interval to read the file, forcing as OS flush.
    // Some loggers using a file streamers prevent the flush
    // that would trigger the file watch used by node-tail.
    var interval = null;

    // Complete function ends grunt task and cleans up the tail.
    function complete (isSuccess) {

      // Stop the timers now we are complete.
      if (timer) {
        clearTimeout(timer);
      }

      if (interval) {
        clearTimeout(interval);
      }

      // Stop watching the file.
      tail.unwatch();

      // Tell grunt that we have finished doing what we need to do.
      done(isSuccess);

    }

    // Set the timeout for the task, as it is async, best to have one of these.
    timer = setTimeout(function() {

      grunt.verbose.error('Tail: Failed. Timeout reached.');

      complete(false);

    }, timeout);

    // Ensure the file exists or timeout reached before we continue.
    var found = false;

    while (!found) {
      found = fs.existsSync(options.fileName);
    }

    grunt.verbose.writeln('Tail: File found, begin tail.');

    // Create the tail for our input file.
    var watchOptions = {};
    var tail = new Tail(options.fileName, options.lineSeparator, watchOptions, options.fromBeginning);

    // Check the contents of each line tailed.
    tail.on("line", function (data) {

      // Check if the new line matched our desired output.
      if (data.match(regex)) {

        // Tell grunt we are ok.
        grunt.log.ok('Tail: Success. Match found, continuing to next task.');

        complete(true);

      }

    });

    // Force the file to flush if it hasn't.
    interval = setInterval(function () {
      var fd = fs.openSync(options.fileName, 'r');
      fs.closeSync(fd);
    }, 500);

    if (options.forceWatchFromBeginning) {

      grunt.verbose.writeln('Tail: Writting to file to force watcher.');

      // TODO: Triggers the watch, so the read for the tail starts at the start of an exisiting file. Not great.
      // This is needed if between the start of this task and the beginning of the next the watched file has
      // already been finished with.
      fs.appendFileSync(options.fileName, ' ');
    }

  });

};