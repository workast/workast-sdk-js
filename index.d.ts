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
 * Options to impersonate a user.
**/
declare interface ImpersonateOptions {
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
  impersonate?: ImpersonateOptions
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

/**
 * Instantiates a Workast SDK.
 *
 * @param token - The Workast token.
 * @param config - Additional configuration.
 *
 * @returns {Workast} A Workast SDK instance.
 * */
declare class Workast {
  constructor(token: string, config?: SDKConfiguration);

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
   * Makes an HTTP request to the Workast API.
   *
   * @param options - HTTP request options.
   *
   * @returns {Promise<Object|undefined>} A promise that resolves to the HTTP response body.
   * Otherwise, it rejects with the appropriate error.
   * 
   * @public
  * */
  apiCall(options?: HTTPRequestOptions): Promise<Object> | Promise<undefined>
}

export = Workast;
