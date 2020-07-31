'use strict';

const { generateMethod, generateBasicMethods, RESOURCE_PATH, BASIC_METHODS } = require('./helpers');

module.exports = (workast) => ({
  ...generateBasicMethods(
    workast,
    RESOURCE_PATH.NOTIFICATION,
    [
      BASIC_METHODS.LIST
    ]
  ),
  markAllAsRead: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.NOTIFICATION}/read`
  }),
  markAsRead: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.NOTIFICATION}/{notificationId}/read`
  }),
  markAsUnread: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.NOTIFICATION}/{notificationId}/unread`
  }),
  retrieveSettings: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.NOTIFICATION}/settings`
  }),
  subscribe: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.NOTIFICATION}/subscribe`
  }),
  unsubscribe: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.NOTIFICATION}/unsubscribe`
  }),
  updateSettings: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.NOTIFICATION}/settings`
  })
});
