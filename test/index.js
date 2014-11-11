var should = require('should');
var benchmark = require('directiv-test-benchmark');
var relative = require('../');
var locales = {
  en_tense: require('./locales/en_tense'),
  en_short_tense: require('./locales/en_short_tense'),
  en: require('./locales/en')
};

describe('relative', function() {
  it('should correctly format relative dates with long form tense', function() {
    var times = lang('en_tense');

    times[1].should.eql(['in a second']);
    times[-1].should.eql(['a second ago']);
    times[59].should.eql(['in ', 59, ' seconds']);
    times[-59].should.eql([59, ' seconds ago']);

    times[60].should.eql(['in a minute']);
    times[-60].should.eql(['a minute ago']);
    times[3599].should.eql(['in ', 59, ' minutes']);
    times[-3599].should.eql([59, ' minutes ago']);

    times[3600].should.eql(['in an hour']);
    times[-3600].should.eql(['an hour ago']);
    times[86399].should.eql(['in ', 23, ' hours']);
    times[-86399].should.eql([23, ' hours ago']);

    times[86400].should.eql(['in a day']);
    times[-86400].should.eql(['a day ago']);
    times[2591999].should.eql(['in ', 29, ' days']);
    times[-2591999].should.eql([29, ' days ago']);

    times[2592000].should.eql(['in a month']);
    times[-2592000].should.eql(['a month ago']);
    times[31103999].should.eql(['in ', 11, ' months']);
    times[-31103999].should.eql([11, ' months ago']);

    times[31104000].should.eql(['in a year']);
    times[-31104000].should.eql(['a year ago']);
    times[123456789].should.eql(['in ', 3, ' years']);
    times[-123456789].should.eql([3, ' years ago']);
  });

  it('should correctly format relative dates with short tense', function() {
    var times = lang('en_short_tense');

    times[1].should.eql(['in ', 'a second']);
    times[-1].should.eql(['a second', ' ago']);
    times[59].should.eql(['in ', 59, ' seconds']);
    times[-59].should.eql([59, ' seconds', ' ago']);

    times[60].should.eql(['in ', 'a minute']);
    times[-60].should.eql(['a minute', ' ago']);
    times[3599].should.eql(['in ', 59, ' minutes']);
    times[-3599].should.eql([59, ' minutes', ' ago']);

    times[3600].should.eql(['in ', 'an hour']);
    times[-3600].should.eql(['an hour', ' ago']);
    times[86399].should.eql(['in ', 23, ' hours']);
    times[-86399].should.eql([23, ' hours', ' ago']);

    times[86400].should.eql(['in ', 'a day']);
    times[-86400].should.eql(['a day', ' ago']);
    times[2591999].should.eql(['in ', 29, ' days']);
    times[-2591999].should.eql([29, ' days', ' ago']);

    times[2592000].should.eql(['in ', 'a month']);
    times[-2592000].should.eql(['a month', ' ago']);
    times[31103999].should.eql(['in ', 11, ' months']);
    times[-31103999].should.eql([11, ' months', ' ago']);

    times[31104000].should.eql(['in ', 'a year']);
    times[-31104000].should.eql(['a year', ' ago']);
    times[123456789].should.eql(['in ', 3, ' years']);
    times[-123456789].should.eql([3, ' years', ' ago']);
  });

  it('should remove the tense as an option', function() {
    var times = lang('en');

    times[1].should.eql(['a second']);
    times[-1].should.eql(['a second']);
    times[59].should.eql([59, ' seconds']);
    times[-59].should.eql([59, ' seconds']);

    times[60].should.eql(['a minute']);
    times[-60].should.eql(['a minute']);
    times[3599].should.eql([59, ' minutes']);
    times[-3599].should.eql([59, ' minutes']);

    times[3600].should.eql(['an hour']);
    times[-3600].should.eql(['an hour']);
    times[86399].should.eql([23, ' hours']);
    times[-86399].should.eql([23, ' hours']);

    times[86400].should.eql(['a day']);
    times[-86400].should.eql(['a day']);
    times[2591999].should.eql([29, ' days']);
    times[-2591999].should.eql([29, ' days']);

    times[2592000].should.eql(['a month']);
    times[-2592000].should.eql(['a month']);
    times[31103999].should.eql([11, ' months']);
    times[-31103999].should.eql([11, ' months']);

    times[31104000].should.eql(['a year']);
    times[-31104000].should.eql(['a year']);
    times[123456789].should.eql([3, ' years']);
    times[-123456789].should.eql([3, ' years']);
  });

  describe('benchmarks', function() {
    describe('lang-js-relative', function() {
      var fn = relative(locales.en, 'en');
      benchmark(2000000, 1, fn.bind(null, 123456789));
    });
  });
});

/**
 * Helper function to test a language
 *
 * @param {String} locale
 * @param {Object?} opts
 * @return {Object}
 */

function lang(locale, opts) {
  var fn = relative(locales[locale], locale.split('_')[0], opts);
  return [
    1,
      -1,
    59,
      -59,
    60,
      -60,
    3 * 60,
      -3 * 60,
    3599,
      -3599,
    3600,
      -3600,
    86399,
      -86399,
    86400,
      -86400,
    2591999,
      -2591999,
    2592000,
      -2592000,
    31103999,
      -31103999,
    31104000,
      -31104000,
    123456789,
      -123456789
  ].reduce(function(acc, time) {
    acc[time] = fn(time);
    return acc;
  }, {});
}
