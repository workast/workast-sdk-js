'use strict';

const utils = require('./utils');

/**
 * The Workast SDK configuration.
 *
 * @typedef {Object} WorkastSDKConfiguration
 * @property {number} [timeout = 60000] - The HTTP request timeout in milliseconds.
 * @property {number} [maxRetries = 0] - The maximum amount of request retries.
 * @property {string} [apiBaseUrl = 'https://api.todobot.io'] - The Workast API base URL.
 * @property {string} [authBaseUrl = 'https://my.workast.io'] - The Workast Auth base URL.
 * */

class Workast {
  /**
   * @description Instantiates a Workast SDK.
   *
   * @throws {ConfigurationError} The provided configuration is invalid.
   *
   * @param {string} token - The Workast token.
   * @param {WorkastSDKConfiguration} [config = {}] - Additional configuration.
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
    this.defaults = utils.validateConfig({ token, ...config });
  }
}

module.exports = Workast;
