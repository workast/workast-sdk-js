'use strict';

const { WorkastInvalidParameterError } = require('../../errors');

/**
 * Method spec.
 *
 * @typedef {Object} MethodSpec
 * @property {string} method - The HTTP method. One of 'GET', 'HEAD', 'POST', 'PUT', 'DELETE' or 'PATCH'.
 * @property {string} path - The generic URL path.
 * */

/**
 * @summary Generates an API method from the given spec.
 *
 * @param {Workast} workast - The Workast SDK instance.
 * @param {MethodSpec} spec - The method spec.
 *
 * @returns {Function} An async function to call the API endpoint.
 * */
function generateMethod(workast, spec) {
  // eslint-disable-next-line func-names
  return async function (...args) {
    const urlParamsCount = (spec.path.match(/{\w+}/g) || []).length;

    if (args.length < urlParamsCount) {
      throw new WorkastInvalidParameterError('Missing URL params');
    }

    // Build the actual path.
    let { path } = spec;

    for (let i = 0; i < urlParamsCount; i += 1) {
      path = path.replace(/{\w+}/, args[i]);
    }

    // Determine if body or query should be used.
    let query;
    let body;

    if (['GET', 'HEAD'].includes(spec.method)) {
      query = args[urlParamsCount];
    } else {
      body = args[urlParamsCount];
    }

    // Get the options.
    const options = args[urlParamsCount + 1] || {};

    // Perform API call.
    return workast.apiCall({
      ...options, // Keep options first, so properties like 'method' cannot be overwritten.
      method: spec.method,
      path,
      query,
      body
    });
  };
}

module.exports = generateMethod;
