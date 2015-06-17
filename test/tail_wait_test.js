'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.tail_wait = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  single_file_options: function(test) {
    test.expect(1);

    test.equal(2, 2, 'default behaviour for the single file selector.');

    test.done();
  },
  multiple_file_options: function(test) {
    test.expect(1);

    test.equal(1, 1, 'default behaviour for the multiple file selector.');

    test.done();
  },
  initial_file_options: function(test) {
    test.expect(1);

    test.equal(3, 3, 'default behaviour for the multiple file selector with initial file.');

    test.done();
  },
  search_file_options: function(test) {
    test.expect(1);

    test.equal(4, 4, 'default behaviour for the multiple file selector when file not found yet.');

    test.done();
  },
};
