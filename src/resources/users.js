'use strict';

const { generateMethod, generateBasicMethods, RESOURCE_PATH, BASIC_METHODS } = require('./helpers');

module.exports = (workast) => ({
  ...generateBasicMethods(
    workast,
    RESOURCE_PATH.USER,
    [
      BASIC_METHODS.LIST,
      BASIC_METHODS.RETRIEVE,
      BASIC_METHODS.UPDATE
    ]
  ),
  me: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.USER}/me`
  }),
  invite: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.USER}/invite`
  }),
  activate: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.USER}/{userId}/activate`
  }),
  deactivate: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.USER}/{userId}/deactivate`
  })
});
