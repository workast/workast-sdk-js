'use strict';

const isObject = require('lodash.isobject');
const get = require('lodash.get');
const qs = require('qs');

/**
 * @private
 *
 * @description Checks if the given value is a string.
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} True if the given value is a string.
 * Otherwise, it returns false.
 * */
function isString(value) {
  return typeof value === 'string';
}

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
function isInteger(value, { min = -Infinity, max = Infinity } = {}) {
  return Number.isInteger(value) && value >= min && value <= max;
}

/**
 * @private
 *
 * @description Returns a valid URL for the given base URL and path.
 *
 * @param {string} baseUrl - The base URL.
 * @param {string} path - The URL path.
 *
 * @returns {string} The complete URL.
 * */
function normalizeUrl(baseUrl, path) {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedBaseUrl.concat(normalizedPath);
}

/**
 * @private
 *
 * @description Gets the multipart representation of an object.
 *
 * @param {Object} obj - The source object.
 *
 * @returns {Object} The multipart representation of the source object.
 * */
function buildMultipartFields(obj) {
  if (!obj || !Object.keys(obj).length) return {};

  const delimiter = '|&|';
  const str = qs.stringify(obj, { encode: false, delimiter });
  const elements = str.split(delimiter);

  return elements.reduce((acc, elem) => {
    const [key, value] = elem.split('=');
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = {
  isNonEmptyString,
  isInteger,
  normalizeUrl,
  buildMultipartFields,
  isString,
  isObject,
  get
};
