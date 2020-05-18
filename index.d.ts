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

  tasks: TasksResource;

  apiCall(options?: HTTPRequestOptions): Promise<Object> | Promise<undefined>
}

export = Workast;
