'use strict';

const generateMethod = require('./generate-method');

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
    create: generateMethod(workast, { method: 'POST', path: resourcePath }),
    list: generateMethod(workast, { method: 'GET', path: resourcePath }),
    retrieve: generateMethod(workast, { method: 'GET', path: `${resourcePath}/{id}` }),
    update: generateMethod(workast, { method: 'PATCH', path: `${resourcePath}/{id}` }),
    del: generateMethod(workast, { method: 'DELETE', path: `${resourcePath}/{id}` })
  };

  if (!include) return basicMethods;

  return include.reduce((acc, method) => {
    acc[method] = basicMethods[method];
    return acc;
  }, {});
}

module.exports = generateBasicMethods;
