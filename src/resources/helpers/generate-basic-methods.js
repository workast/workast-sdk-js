'use strict';

const generateMethod = require('./generate-method');
const BASIC_METHODS = require('./basic-methods');

/**
 * @summary Generates RESTful HTTP methods for the given resource.
 *
 * @param {Workast} workast - The Workast SDK instance.
 * @param {string} resourcePath - The base path of the resource.
 * @param {string[]} [include] - An array of methods to include. By default all methods are included.
 *
 * @returns {Object} An object that holds the basic methods.
 * */
function generateBasicMethods(workast, resourcePath, include) {
  const basicMethods = {
    [BASIC_METHODS.CREATE]: generateMethod(workast, { method: 'POST', path: resourcePath }),
    [BASIC_METHODS.LIST]: generateMethod(workast, { method: 'GET', path: resourcePath }),
    [BASIC_METHODS.RETRIEVE]: generateMethod(workast, { method: 'GET', path: `${resourcePath}/{id}` }),
    [BASIC_METHODS.UPDATE]: generateMethod(workast, { method: 'PATCH', path: `${resourcePath}/{id}` }),
    [BASIC_METHODS.DELETE]: generateMethod(workast, { method: 'DELETE', path: `${resourcePath}/{id}` })
  };

  if (!include) return basicMethods;

  return include.reduce((acc, method) => {
    acc[method] = basicMethods[method];
    return acc;
  }, {});
}

module.exports = generateBasicMethods;
