'use strict';

const BaseError = require('./base-error');

/**
 * @description Error which is thrown when the provided SDK configuration is invalid.
 *
 * @category Errors
 *
 * @hideconstructor
 * */
class ConfigurationError extends BaseError {}

module.exports = ConfigurationError;
