'use strict';

const { generateMethod, generateBasicMethods, RESOURCE_PATH } = require('./helpers');

module.exports = (workast) => ({
  ...generateBasicMethods(workast, RESOURCE_PATH.TASK, ['retrieve', 'update', 'del']),
  create: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/task`
  }),
  subscribe: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/follow`
  }),
  unsubscribe: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/unfollow`
  }),
  restore: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/restore`
  }),
  complete: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/done`
  }),
  reopen: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/undone`
  }),
  assign: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/assigned`
  }),
  exempt: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.TASK}/{id}/assigned`
  }),
  clone: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/clone`
  }),
  search: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/search`
  }),
  addTags: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/tag`
  }),
  removeTags: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.TASK}/{id}/tag`
  }),
  createAttachment: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/attachment`
  }),
  deleteAttachment: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.TASK}/{id}/attachment/{attachmentId}`
  }),
  updateAttachment: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.TASK}/{id}/attachment/{attachmentId}`
  }),
  createSubtask: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/subtask`
  }),
  listActivity: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.TASK}/{id}/activity`
  }),
  addComment: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.TASK}/{id}/activity`
  }),
  deleteComment: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.TASK}/{id}/activity/{activityId}`
  }),
  updateComment: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.TASK}/{id}/activity/{activityId}`
  })
});
