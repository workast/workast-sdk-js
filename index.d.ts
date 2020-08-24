declare enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

declare enum HttpProgressEventDirection {
  UPLOAD = 'upload',
  DOWNLOAD = 'download'
}

declare interface HttpProgressEvent {
  readonly direction: HttpProgressEventDirection;
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly total?: number;
  readonly percent?: number;
}

declare interface Impersonate {
  team?: string;
  user?: string;
}

declare interface HTTPRequestOptions {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  method?: HttpMethod;
  path?: string;
  query?: Object;
  body?: Object;
  impersonate?: Impersonate
  onProgress?(event: HttpProgressEvent): void;
}

declare interface SDKConfiguration {
  timeout?: number;
  maxRetries?: number;
  apiBaseUrl?: string;
  authBaseUrl?: string;
}

declare interface ResourceRequestOptions {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  impersonate?: Impersonate
  onProgress?(event: HttpProgressEvent): void;
}

declare interface ListsResource {
  addComment(listId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  addParticipants(listId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  archive(listId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  create(body: Object, options?: ResourceRequestOptions): Promise<Object>
  createAttachment(listId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  createNote(listId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  createSublist(listId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  deleteAttachment(listId: string, attachmentId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  deleteComment(listId: string, commentId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  deleteSublist(listId: string, sublistId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  importTemplate(listId: string, templateId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  join(listId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  list(query?: Object, options?: ResourceRequestOptions): Promise<Object>
  listActivity(listId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  listAttachments(listId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  listParticipants(listId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  listNotes(listId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  moveTasks(listId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  personal(query?: Object, options?: ResourceRequestOptions): Promise<Object>
  removeParticipants(listId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  retrieve(listId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  retrieveNote(listId: string, noteId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  unarchive(listId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  update(listId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateAttachment(listId: string, attachmentId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateComment(listId: string, commentId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateNote(listId: string, noteId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateSublist(listId: string, sublistId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
}

declare interface NotificationsResource {
  list(query?: Object, options?: ResourceRequestOptions): Promise<Object>
  markAllAsRead(body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  markAsRead(notificationId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  markAsUnread(notificationId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  retrieveSettings(query?: Object, options?: ResourceRequestOptions): Promise<Object>
  subscribe(body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  unsubscribe(body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateSettings(body: Object, options?: ResourceRequestOptions): Promise<undefined>
}

declare interface TagsResource {
  create(body: Object, options?: ResourceRequestOptions): Promise<Object>
  del(tagId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  list(query?: Object, options?: ResourceRequestOptions): Promise<Object>
  update(tagId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
}

declare interface TasksResource {
  create(spaceId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  retrieve(taskId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  update(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  del(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  subscribe(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  unsubscribe(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  restore(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  complete(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  reopen(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  assign(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  unassign(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  clone(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<Object>
  search(body: Object, options?: ResourceRequestOptions): Promise<Object>
  addTags(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  removeTags(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  createAttachment(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  deleteAttachment(taskId: string, attachmentId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateAttachment(taskId: string, attachmentId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  createSubtask(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  listActivity(taskId: string, query?: Object, options?: ResourceRequestOptions): Promise<Object>
  addComment(taskId: string, body: Object, options?: ResourceRequestOptions): Promise<Object>
  deleteComment(taskId: string, commentId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
  updateComment(taskId: string, commentId: string, body: Object, options?: ResourceRequestOptions): Promise<undefined>
  markAllNotificationsAsRead(taskId: string, body?: Object, options?: ResourceRequestOptions): Promise<undefined>
}

declare class Workast {
  static DEFAULT_TIMEOUT: number;
  static DEFAULT_MAX_RETRIES: number;
  static DEFAULT_API_BASE_URL: string;
  static DEFAULT_AUTH_BASE_URL: string;
  static ALLOWED_HTTP_METHODS: HttpMethod[];
  static IMPERSONATE_TEAM_HEADER: string;
  static IMPERSONATE_USER_HEADER: string;
  static AUTHENTICATION_SCHEME: string;
  static DEFAULT_CONTENT_TYPE: string;

  constructor(token: string, config?: SDKConfiguration);

  lists: ListsResource;
  notifications: NotificationsResource;
  tags: TagsResource;
  tasks: TasksResource;

  apiCall(options?: HTTPRequestOptions): Promise<Object> | Promise<undefined>
}

export = Workast;
