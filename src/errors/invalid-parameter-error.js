'use strict';

const BaseError = require('./base-error');

/**
 * @description Error which is thrown when any of the provided parameters is invalid.
 *
 * @category Errors
 *
 * @hideconstructor
 * */
class WorkastInvalidParameterError extends BaseError {}

module.exports = WorkastInvalidParameterError;
