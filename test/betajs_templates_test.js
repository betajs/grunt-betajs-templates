'use strict';

var grunt = require('grunt');

exports.betajs_templates = {
  setUp: function(done) {
    done();
  },

  // test default config
  default: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/expected.js');
    var expected = grunt.file.read('test/expected/expected.js');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
};
