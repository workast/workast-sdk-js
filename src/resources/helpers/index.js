'use strict';

const generateMethod = require('./generate-method');
const generateBasicMethods = require('./generate-basic-methods');
const RESOURCE_PATH = require('./resource-path');
const BASIC_METHODS = require('./basic-methods');

module.exports = {
  generateMethod,
  generateBasicMethods,
  RESOURCE_PATH,
  BASIC_METHODS
};
