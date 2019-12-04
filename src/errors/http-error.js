'use strict';

const BaseError = require('./base-error');
const utils = require('../utils');

/**
 * @description Error which is thrown when the Workast API responds with a non 2xx status code or
 * there are network failures, timeouts or other errors that prevent the HTTP request to be completed.
 *
 * @category Errors
 *
 * @hideconstructor
 * */
class WorkastHTTPError extends BaseError {
  /**
   * @description Instantiates a WorkastHTTPError.
   *
   * @param {Error} err - An error thrown by superagent.
   * */
  constructor(err) {
    let { message } = err;
    let type = 'RequestError';
    let statusCode;

    if (err.status) {
      const { body } = err.response;
      message = utils.get(
        body,
        'error.message',
        utils.get(body, 'message', `Request failed with status code ${err.status}`)
      );
      type = utils.get(body, 'error.name', 'ResponseError');
      statusCode = err.status;
    } else if (err.timeout) {
      message = `Request timed out after ${err.timeout} ms`;
      type = 'RequestTimeoutError';
    }

    super(message);
    this.type = type;
    if (statusCode) this.statusCode = statusCode;
  }
}

module.exports = WorkastHTTPError;
