/**
 * Allowed HTTP methods.
**/
declare enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

/**
 * Impersonation options.
**/
declare interface Impersonate {
  /**
   * The ID of the team to impersonate. 
  **/
  team?: string;

  /**
   * The ID of the user to impersonate.
  **/
  user?: string;
}

/**
 * Options to make a HTTP request to the Workast API.
**/
declare interface HTTPRequestOptions {
  /**
   * The base URL.
  **/
  baseUrl?: string;

  /**
   * The HTTP request timeout in milliseconds.
  **/
  timeout?: number;

  /**
   * The maximum amount of request retries.
  **/
  maxRetries?: number;
  
  /**
   * The HTTP method. Default: `GET`
  **/
  method?: HttpMethod;
  
  /**
   * The URL path. Default: `/`
  **/
  path?: string;

  /**
   * The key-values to be added to the query-string.
  **/
  query?: Object;

  /**
   * The request payload.
  **/
  body?: Object;

  /**
   * The impersonation options.
  **/
  impersonate?: Impersonate

  /**
   * A callback for progress events during the upload or download of large files.
  **/
  onProgress?(event: Object): void;
}

/**
 * The Workast SDK configuration. 
**/
declare interface SDKConfiguration {
  /**
   * The HTTP request timeout in milliseconds. Default: `120000`
  **/
  timeout?: number;
  
  /**
   * The maximum amount of request retries. Default: `0`
  **/
  maxRetries?: number;

  /**
   * The Workast API base url. Default: `https://api.todobot.io`
  **/
  apiBaseUrl?: string;

  /**
   * The Workast Auth base url. Default: `https://my.workast.io`
  **/
  authBaseUrl?: string;
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

  /**
   * Instantiates a Workast SDK.
   * */
  constructor(token: string, config?: SDKConfiguration);

  /**
   * Makes an HTTP request to the Workast API.
  * */
  apiCall(options?: HTTPRequestOptions): Promise<Object> | Promise<undefined>
}

export = Workast;
