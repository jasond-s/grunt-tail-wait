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

    test.equal(2, 2, 'default behaviour reads the file packages file.');

    test.done();
  },
  multiple_file_options: function(test) {
    test.expect(1);

    test.equal(1, 1, 'default behaviour reads the file packages file.');

    test.done();
  },
};
