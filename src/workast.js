'use strict';

const utils = require('./utils');
const { ConfigurationError } = require('./errors');

/**
 * The Workast SDK configuration.
 *
 * @typedef {Object} SDKConfiguration
 * @property {number} [timeout = 120000] - The HTTP request timeout in milliseconds.
 * @property {number} [maxRetries = 0] - The maximum amount of request retries.
 * @property {string} [apiBaseUrl = 'https://api.todobot.io'] - The Workast API base URL.
 * @property {string} [authBaseUrl = 'https://my.workast.io'] - The Workast Auth base URL.
 * */

class Workast {
  static get DEFAULT_TIMEOUT() { return 12e4; } // 2 minutes.

  static get DEFAULT_MAX_RETRIES() { return 0; } // Retries should only be used with requests that are idempotent.

  static get DEFAULT_API_BASE_URL() { return 'https://api.todobot.io'; }

  static get DEFAULT_AUTH_BASE_URL() { return 'https://my.workast.io'; }

  /**
   * @description Instantiates a Workast SDK.
   *
   * @throws {ConfigurationError} The provided configuration is invalid.
   *
   * @param {string} token - The Workast token.
   * @param {SDKConfiguration} [config = {}] - Additional configuration.
   *
   * @returns {Workast} A Workast SDK instance.
   *
   * @example
   *
   * 'use strict';
   *
   * const Workast = require('@workast/sdk');
   *
   * const workast = new Workast('wat::123456789', {
   *   timeout: 120000,
   *   maxRetries: 3,
   *   apiBaseUrl: 'https://api.example.com',
   *   authBaseUrl: 'https://auth.example.com'
   * });
   * */
  constructor(token, config = {}) {
    const normalizedApiBaseUrl = utils.normalizeUrl(config.apiBaseUrl);
    const normalizedAuthBaseUrl = utils.normalizeUrl(config.authBaseUrl);

    if (!utils.isNonEmptyString(token)) {
      throw new ConfigurationError('Token must be a non-empty string.');
    }

    if (config.timeout !== undefined && !utils.isValidInteger(config.timeout, { min: 1 })) {
      throw new ConfigurationError('Timeout must be an integer greater than zero.');
    }

    if (config.maxRetries !== undefined && !utils.isValidInteger(config.maxRetries, { min: 0 })) {
      throw new ConfigurationError('Max retries must be an integer greater than or equal to zero.');
    }

    if (normalizedApiBaseUrl !== undefined && !utils.isNonEmptyString(normalizedApiBaseUrl)) {
      throw new ConfigurationError('API base URL must be a non-empty string.');
    }

    if (normalizedAuthBaseUrl !== undefined && !utils.isNonEmptyString(normalizedAuthBaseUrl)) {
      throw new ConfigurationError('Auth base URL must be a non-empty string.');
    }

    this.api = {
      token,
      timeout: config.timeout || Workast.DEFAULT_TIMEOUT,
      maxRetries: config.maxRetries !== undefined ? config.maxRetries : Workast.DEFAULT_MAX_RETRIES,
      apiBaseUrl: normalizedApiBaseUrl || Workast.DEFAULT_API_BASE_URL,
      authBaseUrl: normalizedAuthBaseUrl || Workast.DEFAULT_AUTH_BASE_URL
    };
  }
}

module.exports = Workast;
