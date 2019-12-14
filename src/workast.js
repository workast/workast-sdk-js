/**
 * Copyright (c) Workast, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * */

'use strict';

const request = require('superagent');
const utils = require('./utils');
const { WorkastInvalidParameterError, WorkastHTTPError } = require('./errors');

/**
 * The Workast SDK configuration.
 *
 * @typedef {Object} SDKConfiguration
 * @property {number} [timeout = 120000] - The HTTP request timeout in milliseconds.
 * @property {number} [maxRetries = 0] - The maximum amount of request retries.
 * @property {string} [apiBaseUrl = 'https://api.todobot.io'] - The Workast API base URL.
 * @property {string} [authBaseUrl = 'https://my.workast.io'] - The Workast Auth base URL.
 * */

/**
 * Options to make a HTTP request to the Workast API.
 *
 * @typedef {Object} HTTPRequestOptions
 * @property {string} [baseUrl] - The base URL.
 * @property {number} [timeout] - The HTTP request timeout in milliseconds.
 * @property {number} [maxRetries] - The maximum amount of request retries.
 * @property {string} [method = 'GET'] - The HTTP method.
 * @property {string} [path = '/'] - The URL path.
 * @property {Object} [query = {}] - The key-values to be added to the query-string.
 * @property {Object} [body = {}] - The request payload.
 * @property {Object} [impersonate] - The impersonation options.
 * @property {string} [impersonate.team] - The ID of the team to impersonate.
 * @property {string} [impersonate.user] - The ID of the user to impersonate.
 * */

class Workast {
  static get DEFAULT_TIMEOUT() { return 12e4; } // 2 minutes.

  static get DEFAULT_MAX_RETRIES() { return 0; } // Retries should only be used with requests that are idempotent.

  static get DEFAULT_API_BASE_URL() { return 'https://api.todobot.io'; }

  static get DEFAULT_AUTH_BASE_URL() { return 'https://my.workast.io'; }

  static get ALLOWED_HTTP_METHODS() { return ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH']; }

  static get IMPERSONATE_TEAM_HEADER() { return 'W-TEAM-ID'; }

  static get IMPERSONATE_USER_HEADER() { return 'W-USER-ID'; }

  static get AUTHENTICATION_SCHEME() { return 'Bearer'; }

  static get DEFAULT_CONTENT_TYPE() { return 'application/json'; }

  /**
   * @description Instantiates a Workast SDK.
   *
   * @throws {WorkastInvalidParameterError} The provided configuration is invalid.
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
    const timeout = utils.get(config, 'timeout', Workast.DEFAULT_TIMEOUT);
    const maxRetries = utils.get(config, 'maxRetries', Workast.DEFAULT_MAX_RETRIES);
    const apiBaseUrl = utils.get(config, 'apiBaseUrl', Workast.DEFAULT_API_BASE_URL);
    const authBaseUrl = utils.get(config, 'authBaseUrl', Workast.DEFAULT_AUTH_BASE_URL);

    if (!utils.isNonEmptyString(token)) {
      throw new WorkastInvalidParameterError('Token must be a non-empty string.');
    }
    if (!utils.isInteger(timeout, { min: 1 })) {
      throw new WorkastInvalidParameterError('Timeout must be an integer greater than zero.');
    }
    if (!utils.isInteger(maxRetries, { min: 0 })) {
      throw new WorkastInvalidParameterError('Max retries must be an integer greater than or equal to zero.');
    }
    if (!utils.isNonEmptyString(apiBaseUrl)) {
      throw new WorkastInvalidParameterError('API base URL must be a non-empty string.');
    }
    if (!utils.isNonEmptyString(authBaseUrl)) {
      throw new WorkastInvalidParameterError('Auth base URL must be a non-empty string.');
    }

    this.config = { token, timeout, maxRetries, apiBaseUrl, authBaseUrl };
  }

  /**
   * @description Makes an HTTP request to the Workast API.
   *
   * @param {HTTPRequestOptions} [options = {}] - HTTP request options.
   *
   * @returns {Promise<Object|undefined>} A promise that resolves to the HTTP response body.
   * Otherwise, it rejects with the appropriate error.
   *
   * @example
   *
   * 'use strict';
   *
   * const Workast = require('@workast/sdk');
   *
   * const workast = new Workast('wat::123456789');
   *
   * const subtask = await workast.apiCall({
   *   baseUrl: 'https://example.com',
   *   timeout: 5000,
   *   maxRetries: 3,
   *   method: 'POST',
   *   path: '/task/30ac769052aaf30d4a3259da8abeafe6/subtask',
   *   body: {
   *     text: 'A new sub-task'
   *   },
   *   impersonate: {
   *     team: 'ca19601b6bb816ca95386698b3385d49',
   *     user: 'b32bbb34014a8110d040d31a162c3091'
   *   }
   * });
   * */
  async apiCall(options = {}) {
    const baseUrl = utils.get(options, 'baseUrl', this.config.apiBaseUrl);
    const timeout = utils.get(options, 'timeout', this.config.timeout);
    const maxRetries = utils.get(options, 'maxRetries', this.config.maxRetries);
    const method = utils.get(options, 'method', 'GET');
    const path = utils.get(options, 'path', '/');
    const query = utils.get(options, 'query', {});
    const body = utils.get(options, 'body', {});
    const impersonatedTeam = utils.get(options, 'impersonate.team');
    const impersonatedUser = utils.get(options, 'impersonate.user');

    if (!utils.isNonEmptyString(baseUrl)) {
      throw new WorkastInvalidParameterError('Base URL must be a non-empty string.');
    }
    if (!utils.isInteger(timeout, { min: 1 })) {
      throw new WorkastInvalidParameterError('Timeout must be an integer greater than zero.');
    }
    if (!utils.isInteger(maxRetries, { min: 0 })) {
      throw new WorkastInvalidParameterError('Max retries must be an integer greater than or equal to zero.');
    }
    if (!Workast.ALLOWED_HTTP_METHODS.includes(method)) {
      throw new WorkastInvalidParameterError(`Method must be one of ${Workast.ALLOWED_HTTP_METHODS.join(', ')}.`);
    }
    if (!utils.isString(path)) {
      throw new WorkastInvalidParameterError('Path must be a string.');
    }
    if (!utils.isObject(query)) {
      throw new WorkastInvalidParameterError('Query must be an object.');
    }
    if (!utils.isObject(body)) {
      throw new WorkastInvalidParameterError('Body must be an object.');
    }
    if (impersonatedTeam && !utils.isString(impersonatedTeam)) {
      throw new WorkastInvalidParameterError('Impersonated team must be a string.');
    }
    if (impersonatedUser && !utils.isString(impersonatedUser)) {
      throw new WorkastInvalidParameterError('Impersonated user must be a string.');
    }

    const url = utils.normalizeUrl(baseUrl, path);
    const headers = {
      Accept: Workast.DEFAULT_CONTENT_TYPE,
      Authorization: `${Workast.AUTHENTICATION_SCHEME} ${this.config.token}`
    };

    if (impersonatedTeam) {
      headers[Workast.IMPERSONATE_TEAM_HEADER] = impersonatedTeam;
    }
    if (impersonatedUser) {
      headers[Workast.IMPERSONATE_USER_HEADER] = impersonatedUser;
    }

    try {
      let res;
      const { file, ...data } = body;
      const req = request(method, url)
        .timeout(timeout)
        .retry(maxRetries)
        .query(query)
        .set(headers);

      if (file) {
        // Make a multipart request.
        const fields = utils.buildMultipartFields(data);
        res = await req.field(fields).attach('file', file);
      } else {
        // Make a json request.
        res = await req.send(data).type(Workast.DEFAULT_CONTENT_TYPE);
      }

      return Object.keys(res.body).length ? res.body : undefined;
    } catch (err) {
      throw new WorkastHTTPError(err);
    }
  }
}

module.exports = Workast;
