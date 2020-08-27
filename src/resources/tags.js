'use strict';

const { generateBasicMethods, RESOURCE_PATH, BASIC_METHODS } = require('./helpers');

module.exports = (workast) => ({
  ...generateBasicMethods(
    workast,
    RESOURCE_PATH.TAG,
    [
      BASIC_METHODS.CREATE,
      BASIC_METHODS.DELETE,
      BASIC_METHODS.LIST,
      BASIC_METHODS.UPDATE
    ]
  )
});
