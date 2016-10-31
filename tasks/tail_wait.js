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

    var data = this.data.fileName ? this.data : this.options();

    var files = data.fileName ? [data.fileName] : this.filesSrc;

    // Populate some options and fail is required options are not present.
    var options = {

      // Required props.
      fileName: files,
      regex: data.regex,

      // Not required props, have defaults.
      initialFile: data.initialFile || null,
      lineSeparator: data.lineSeparator || '\n',
      timeout: data.timeout || 30000,
      fromBeginning: data.fromBeginning || false,
      printMatch: data.printMatch || false,

      // This is only needed if the file watched has been
      // completed before the start of this task.
      forceWatchFromBeginning: data.forceWatchFromBeginning || false
    };

    // The regular expression we want to check for.
    var regex = new RegExp(options.regex, 'g');

    // The length of time we will wait for our result.
    var timeout = options.timeout;

    // The timer used to cancel and move on if tail fails.
    var timer = null;

    // The timer used for the searcher if no files found at startup.
    var search = null;

    // An interval to read the file, forcing as OS flush.
    // Some loggers using a file streamers prevent the flush
    // that would trigger the file watch used by node-tail.
    var intervals = [];
    var tails = [];

    // Complete function ends grunt task and cleans up the tail.
    function complete (isSuccess) {

      // Stop the timers now we are complete.
      if (timer) {
        clearTimeout(timer);
      }

      for (var i = options.fileName.length - 1; i >= 0; i--) {

        if (intervals[i]) {
          clearTimeout(intervals[i]);
        }

        // Stop watching the file.
        tails[i].unwatch();
      }

      // Tell grunt that we have finished doing what we need to do.
      done(isSuccess);
    }

    // Set the timeout for the task, as it is async, best to have one of these.
    timer = setTimeout(function() {

      grunt.verbose.error('Tail: Failed. Timeout reached.');

      complete(false);

    }, timeout);


    // The processing function for a single file

    var process = function (innerFile) {

      grunt.verbose.writeln('Tail: Begin. ' + innerFile);

      // Ensure the file exists or timeout reached before we continue.
      var found = false;

      while (!found) {
        found = fs.existsSync(innerFile);
      }

      grunt.verbose.writeln('Tail: File found, begin tail. ' + innerFile);

      // Create the tail for our input file.
      var watchOptions = {};
      var tail = new Tail(innerFile, options.lineSeparator, watchOptions, options.fromBeginning);

      tails.push(tail);

      // Check the contents of each line tailed.
      tail.on("line", function (data) {

        // Check if the new line matched our desired output.
        if (data.match(regex)) {

          // Tell grunt we are ok.
          grunt.log.ok('Tail: Success. Match found, continuing to next task. ' + innerFile);

          if (options.printMatch) {
              grunt.log.write(data);
          }

          complete(true);
        }
      });

      // Force the file to flush if it hasn't.
      intervals.push(setInterval(function () {

        var fd = fs.openSync(innerFile, 'r');

        fs.closeSync(fd);
      }, 500));

      // Force watching from the beginning of the file.
      if (options.forceWatchFromBeginning) {

        grunt.verbose.writeln('Tail: Writting to file to force watcher. ' + innerFile);

        // TODO: Triggers the watch, so the read for the tail starts at the start of an exisiting file. Not great.
        // This is needed if between the start of this task and the beginning of the next the watched file has
        // already been finished with.
        fs.appendFileSync(innerFile, String.fromCharCode(0x200B));
      }
    };


    // Process the whole queue of files.
    var processQueue = function () {

      // Works for multiple files so go and watch them all.
      for (var i = options.fileName.length - 1; i >= 0; i--) {

        process(options.fileName[i]);
      }
    };


    // If the list of files discovered fall back to an initial file.
    options.fileName = options.fileName.length
      ? options.fileName
      : options.initialFile
        ? [options.initialFile]
        : [];


    // If no files have been initially discovered for pattern, then try to rematch.
    if (options.fileName.length < 1 && this.data.files){

      grunt.verbose.writeln('Tail: Search for files: ' + options.fileName);

      search = setInterval(function () {

        var newFiles = grunt.file.expand(data.files);

        if (newFiles.length > 0 && search) {

          // Clear the timeout now we have some files to tail.
          clearTimeout(search);

          search = null;

          // Set the new files to tail.
          options.fileName = grunt.file.expand(data.files);

          processQueue();
        }
      }, 500);

    } else {

      processQueue();
    }
  });
};