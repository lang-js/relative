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
  var key = opts.pluralKey = opts.pluralKey || strings._plural_key || 'time';
  var limits = opts.limits || defaultLimits;

  var past = {};
  var future = {};

  compile(strings, locale, 's', past, future, key, opts);
  compile(strings, locale, 'm', past, future, key, opts);
  compile(strings, locale, 'h', past, future, key, opts);
  compile(strings, locale, 'd', past, future, key, opts);
  compile(strings, locale, 'M', past, future, key, opts);
  compile(strings, locale, 'y', past, future, key, opts);

  /**
   * Return a translated relative time based on the diff (in seconds)
   *
   * @param {Integer} diff
   * @return {Array}
   */

  return function(params) {
    var diff = getDiff(key, params);
    if (diff === null) throw new Error('Missing relative time key "' + key + '"');
    var duration = Math.abs(diff);

    for (var i = 0, l = limits.length, t, fn; i < l; i++) {
      t = limits[i];
      if (t.limit < duration) continue;
      fn = diff > 0 ? future[t.label] : past[t.label];
      return fn(createParam(Math.floor(duration / t.div), key, params));
    }
  };
}

/**
 * Compile a specific property (s, m, h, etc)
 *
 * @param {Object} strings
 * @param {String} locale
 * @param {String} prop
 * @param {Object} past
 * @param {Object} future
 * @param {Object} opts
 */

function compile(strings, locale, prop, past, future, key, opts) {
  var str = strings[prop];

  if (str && strings.past && strings.future) return compileTenses(strings, str, locale, prop, past, future, key, opts);

  if (str) return past[prop] = future[prop] = translate(str, locale, opts);

  if (strings['+' + prop] && strings['-' + prop]) {
    past[prop] = translate(strings['-' + prop], locale, opts);
    future[prop] = translate(strings['+' + prop], locale, opts);
    return;
  }

  if (!str) throw new Error('Missing "' + prop + '" for "' + locale + '"');
}

/**
 * Compile a property, merging in future and past strings
 *
 * @param {Object} strings
 * @param {String} str
 * @param {String} locale
 * @param {String} prop
 * @param {Object} past
 * @param {Object} future
 * @param {String} key
 * @param {Object} opts
 */

function compileTenses(strings, str, locale, prop, past, future, key, opts) {
  var p = translate(strings.past, locale, opts);
  var f = translate(strings.future, locale, opts);
  var t = translate(str, locale, opts);

  past[prop] = function(params) {
    var time = t(params);
    var res = p(createParam(time, key, params));
    return flatten(res);
  };

  future[prop] = function(params) {
    var time = t(params);
    var res = f(createParam(time, key, params));
    return flatten(res);
  };
}

/**
 * Flatten an array of arrays
 *
 * @param {Array} a
 * @return {Array}
 */

function flatten(a) {
  var arr = [];
  for (var i = 0, l = a.length, t; i < l; i++) {
    t = a[i];
    if (Array.isArray(t)) Array.prototype.push.apply(arr, t);
    else arr.push(t);
  }

  return arr;
}

/**
 * Get the difference from the params
 *
 * @param {String} key
 * @param {Object} params
 * @return {Number}
 */

function getDiff(key, params) {
  if (typeof params === 'number') return params;
  if (!params) return null;
  return params[key];
}

/**
 * Create a parameter object with a key
 *
 * @param {Integer} time
 * @param {String} key
 * @return {Object}
 */

function createParam(time, key, params) {
  var cloned = {};
  if (typeof params === 'number') {
    params = {};
  } else {
    for (var k in params) {
      cloned[k] = params[k];
    }
  }
  cloned[key] = time;
  return cloned;
}
