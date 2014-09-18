var should = require('should');
var benchmark = require('directiv-test-benchmark');
var relative = require('../');
var en = require('./locales/en');

describe('relative', function() {
  it('should correctly format relative dates', function() {
    var fn = relative(en, 'en');

    fn(1).should.eql(['in ', 'a second']);
    fn(-1).should.eql(['a second', ' ago']);
    fn(59).should.eql(['in ', 59, ' seconds']);
    fn(-59).should.eql([59, ' seconds', ' ago']);

    fn(60).should.eql(['in ', 'a minute']);
    fn(-60).should.eql(['a minute', ' ago']);
    fn(3599).should.eql(['in ', 59, ' minutes']);
    fn(-3599).should.eql([59, ' minutes', ' ago']);

    fn(3600).should.eql(['in ', 'an hour']);
    fn(-3600).should.eql(['an hour', ' ago']);
    fn(86399).should.eql(['in ', 23, ' hours']);
    fn(-86399).should.eql([23, ' hours', ' ago']);

    fn(86400).should.eql(['in ', 'a day']);
    fn(-86400).should.eql(['a day', ' ago']);
    fn(2591999).should.eql(['in ', 29, ' days']);
    fn(-2591999).should.eql([29, ' days', ' ago']);

    fn(2592000).should.eql(['in ', 'a month']);
    fn(-2592000).should.eql(['a month', ' ago']);
    fn(31103999).should.eql(['in ', 11, ' months']);
    fn(-31103999).should.eql([11, ' months', ' ago']);

    fn(31104000).should.eql(['in ', 'a year']);
    fn(-31104000).should.eql(['a year', ' ago']);
    fn(123456789).should.eql(['in ', 3, ' years']);
    fn(-123456789).should.eql([3, ' years', ' ago']);
  });

  it('should remove the tense if not present', function() {
    var enWithoutTense = JSON.parse(JSON.stringify(en));
    delete enWithoutTense.past;
    delete enWithoutTense.future;
    var fn = relative(enWithoutTense, 'en');
    fn(60).should.eql(['a minute']);
    fn(3599).should.eql([59, ' minutes']);
  });

  describe('benchmarks', function() {
    describe('lang-js-relative', function() {
      var fn = relative(en, 'en');
      benchmark(2000000, 1, fn.bind(null, 123456789));
    });
  });
});
