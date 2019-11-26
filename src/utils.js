'use strict';

const isString = require('lodash.isstring');

/**
 * @private
 *
 * @description Checks if the given value is a non-empty string.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the given value is a non-empty string.
 * Otherwise, it returns false.
 * */
function isNonEmptyString(value) {
  return isString(value) && value.length > 0;
}

/**
 * @private
 *
 * @description Checks if the given value is a valid integer.
 *
 * @param {*} value - The value to check.
 * @param {Object} [opts = {}] - Additional options.
 * @param {number} [opts.min = -Infinity] - The minimum accepted value.
 * @param {number} [opts.max = Infinity] - The maximum accepted value.
 *
 * @returns {boolean} True if the given value is a valid integer.
 * Otherwise, it returns false.
 * */
function isValidInteger(value, { min = -Infinity, max = Infinity } = {}) {
  return Number.isInteger(value) && value >= min && value <= max;
}

/**
 * @private
 *
 * @description Returns a URL without trailing slashes.
 *
 * @param {*} url - The URL to normalize.
 *
 * @returns {*} The URL without trailing slashes.
 * */
function normalizeUrl(url) {
  return isString(url) && url.endsWith('/') ? url.slice(0, -1) : url;
}

module.exports = {
  isNonEmptyString,
  isValidInteger,
  normalizeUrl
};
