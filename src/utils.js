'use strict';

const isString = require('lodash.isstring');
const { DEFAULT_TIMEOUT, DEFAULT_MAX_RETRIES, DEFAULT_API_BASE_URL, DEFAULT_AUTH_BASE_URL } = require('./constants');
const { ConfigurationError } = require('./errors');

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

/**
 * The SDK configuration.
 *
 * @typedef {Object} SDKConfiguration
 * @property {string} token - The Workast token.
 * @property {number} timeout - The HTTP request timeout in milliseconds.
 * @property {number} maxRetries - The maximum amount of request retries.
 * @property {string} apiBaseUrl - The Workast API base URL.
 * @property {string} authBaseUrl - The Workast Auth base URL.
 * */

/**
 * @private
 *
 * @description Validates the SDK configuration.
 *
 * @throws {ConfigurationError} The provided configuration is invalid.
 *
 * @param {Object} [config = {}] - The SDK configuration.
 * @param {string} [config.token] - The Workast token.
 * @param {number} [config.timeout] - The HTTP request timeout in milliseconds.
 * @param {number} [config.maxRetries] - The maximum amount of request retries.
 * @param {string} [config.apiBaseUrl] - The Workast API base URL.
 * @param {string} [config.authBaseUrl] - The Workast Auth base URL.
 *
 * @returns {SDKConfiguration} The validated SDK configuration.
 * */
function validateConfig({ token, timeout, maxRetries, apiBaseUrl, authBaseUrl } = {}) {
  const normalizedApiBaseUrl = normalizeUrl(apiBaseUrl);
  const normalizedAuthBaseUrl = normalizeUrl(authBaseUrl);

  if (!isNonEmptyString(token)) {
    throw new ConfigurationError('Token must be a non-empty string.');
  }

  if (timeout !== undefined && !isValidInteger(timeout, { min: 1 })) {
    throw new ConfigurationError('Timeout must be an integer greater than zero.');
  }

  if (maxRetries !== undefined && !isValidInteger(maxRetries, { min: 0 })) {
    throw new ConfigurationError('Max retries must be an integer greater than or equal to zero.');
  }

  if (normalizedApiBaseUrl !== undefined && !isNonEmptyString(normalizedApiBaseUrl)) {
    throw new ConfigurationError('API base URL must be a non-empty string.');
  }

  if (normalizedAuthBaseUrl !== undefined && !isNonEmptyString(normalizedAuthBaseUrl)) {
    throw new ConfigurationError('Auth base URL must be a non-empty string.');
  }

  return {
    token,
    timeout: timeout || DEFAULT_TIMEOUT,
    maxRetries: maxRetries !== undefined ? maxRetries : DEFAULT_MAX_RETRIES,
    apiBaseUrl: normalizedApiBaseUrl || DEFAULT_API_BASE_URL,
    authBaseUrl: normalizedAuthBaseUrl || DEFAULT_AUTH_BASE_URL
  };
}

module.exports = {
  validateConfig
};
