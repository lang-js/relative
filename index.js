/**
 * Module dependencies
 */

var translate = require('lang-js-translate');

/**
 * Expose the relative function
 */

exports = module.exports = relative;

/**
 * Setup some default limits
 */

var defaultLimits = [
  {div: 1, limit: 59, label: 's'},             // seconds
  {div: 60, limit: 3599, label: 'm'},          // minutes
  {div: 3600, limit: 86399, label: 'h'},       // hours
  {div: 86400, limit: 2591999, label: 'd'},    // days
  {div: 2592000, limit: 31103999, label: 'M'}, // months
  {div: 31104000, limit: Infinity, label: 'y'} // years
];

/**
 * Compile a relative function
 *
 * @param {Object} strings
 * @param {String} locale
 * @param {Object?} opts
 * @return {Function}
 */

function relative(strings, locale, opts) {
  opts = opts || {};
  var key = opts.pluralKey = opts.pluralKey || 'time';
  var limits = opts.limits || defaultLimits;

  var removeTense = !strings.future && !strings.past || opts.removeTense;

  var fns = {};

  if (!removeTense) {
    compile(strings, locale, 'future', fns, opts);
    compile(strings, locale, 'past', fns, opts);
  }

  compile(strings, locale, 's', fns, opts, removeTense);
  compile(strings, locale, 'm', fns, opts, removeTense);
  compile(strings, locale, 'h', fns, opts, removeTense);
  compile(strings, locale, 'd', fns, opts, removeTense);
  compile(strings, locale, 'M', fns, opts, removeTense);
  compile(strings, locale, 'y', fns, opts, removeTense);

  /**
   * Return a translated relative time based on the diff (in seconds)
   *
   * @param {Integer} diff
   * @return {Array}
   */

  return function(diff) {
    var duration = Math.abs(diff);

    var time;
    for (var i = 0, l = limits.length, t; i < l; i++) {
      t = limits[i];
      if (t.limit < duration) continue;
      time = fns[t.label](Math.floor(duration / t.div));
      break;
    }

    // just return the time without the tense
    if (removeTense) return time;

    var tense = fns[diff > 0 ? 'future' : 'past'];
    var res = tense(createParam(time, key));

    // flatten the result
    var arr = [];
    for (i = 0, l = res.length, t; i < l; i++) {
      t = res[i];
      if (Array.isArray(t)) Array.prototype.push.apply(arr, t);
      else arr.push(t);
    }

    return arr;
  };
}

/**
 * Compile a specific property (s, m, h, etc)
 *
 * @param {Object} strings
 * @param {String} locale
 * @param {String} prop
 * @param {Object} fns
 * @param {Object} opts
 */

function compile(strings, locale, prop, fns, opts, removeTense) {
  var val = removeTense ?
        strings[prop + '-'] || strings[prop] :
        strings[prop];
  if (!val) throw new Error('Missing "' + prop + '" for "' + locale + '"');
  fns[prop] = translate(val, locale, opts);
}

/**
 * Create a parameter object with a key
 *
 * @param {Integer} time
 * @param {String} key
 * @return {Object}
 */

function createParam(time, key) {
  var params = {};
  params[key] = time;
  return params;
}
