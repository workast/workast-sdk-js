'use strict';

const generateMethod = require('./generate-method');

/**
 * @summary Generates RESTful HTTP methods for the given resource.
 *
 * @param {string} resourcePath - The base path of the resource.
 * @param {string[]} [include] - An array of methods to include. By default all methods are included.
 *
 * @returns {Object} An object that holds the methods.
 * */
function generateBasicMethods(resourcePath, include) {
  const basicMethods = {
    create: generateMethod({ method: 'POST', path: resourcePath }),
    list: generateMethod({ method: 'GET', path: resourcePath }),
    retrieve: generateMethod({ method: 'GET', path: `${resourcePath}/{id}` }),
    update: generateMethod({ method: 'PATCH', path: `${resourcePath}/{id}` }),
    del: generateMethod({ method: 'DELETE', path: `${resourcePath}/{id}` })
  };

  if (!include) return basicMethods;

  return include.reduce((acc, method) => {
    acc[method] = basicMethods[method];
    return acc;
  }, {});
}

module.exports = generateBasicMethods;
