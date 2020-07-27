'use strict';

const { generateMethod, generateBasicMethods, RESOURCE_PATH, BASIC_METHODS } = require('./helpers');

module.exports = (workast) => ({
  ...generateBasicMethods(
    workast,
    RESOURCE_PATH.LIST,
    [
      BASIC_METHODS.CREATE,
      BASIC_METHODS.LIST,
      BASIC_METHODS.RETRIEVE,
      BASIC_METHODS.UPDATE
    ]
  ),
  addComment: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/activity`
  }),
  addParticipants: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/participant`
  }),
  archive: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/archive`
  }),
  createAttachment: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/attachment`
  }),
  createNote: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/note`
  }),
  createSublist: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/sublist`
  }),
  deleteAttachment: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.LIST}/{listId}/attachment/{attachmentId}`
  }),
  deleteComment: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.LIST}/{listId}/activity/{activityId}`
  }),
  deleteSublist: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.LIST}/{listId}/sublist/{sublistId}`
  }),
  importTemplate: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/import/{templateId}`
  }),
  join: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/participant/join`
  }),
  listActivity: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/{listId}/activity`
  }),
  listAttachments: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/{listId}/attachment`
  }),
  listParticipants: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/{listId}/participant`
  }),
  listNotes: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/{listId}/note`
  }),
  moveTasks: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/move`
  }),
  personal: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/personal`
  }),
  removeParticipants: generateMethod(workast, {
    method: 'DELETE', path: `${RESOURCE_PATH.LIST}/{listId}/participant`
  }),
  retrieveNote: generateMethod(workast, {
    method: 'GET', path: `${RESOURCE_PATH.LIST}/{listId}/note/{noteId}`
  }),
  unarchive: generateMethod(workast, {
    method: 'POST', path: `${RESOURCE_PATH.LIST}/{listId}/unarchive`
  }),
  updateAttachment: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.LIST}/{listId}/attachment/{attachmentId}`
  }),
  updateComment: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.LIST}/{listId}/activity/{activityId}`
  }),
  updateNote: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.LIST}/{listId}/note/{noteId}`
  }),
  updateSublist: generateMethod(workast, {
    method: 'PATCH', path: `${RESOURCE_PATH.LIST}/{listId}/sublist/{sublistId}`
  })
});
