'use strict';

const superagent = require('superagent');
const { expect, chance, nock, sinon } = require('./index');
const Workast = require('../src/workast');
const { WorkastInvalidParameterError, WorkastHTTPError } = require('../src/errors');
const { RESOURCE_PATH } = require('../src/resources/helpers');

describe('Workast', () => {
  describe('Constructor', () => {
    it('Should throw if "token" is not a non-empty string', () => {
      const token = chance.pickone([
        undefined,
        null,
        '',
        chance.integer(),
        chance.bool(),
        { token: chance.hash() }
      ]);

      expect(() => new Workast(token)).to.throw(
        WorkastInvalidParameterError, 'Token must be a non-empty string.'
      );
    });

    it('Should throw if "config.timeout" is not an integer greater than zero', () => {
      const token = chance.hash();
      const timeout = chance.pickone([
        null,
        chance.hash(),
        chance.integer({ max: 0 }),
        chance.floating(),
        chance.bool(),
        { timeout: chance.integer({ min: 1 }) }
      ]);

      expect(() => new Workast(token, { timeout })).to.throw(
        WorkastInvalidParameterError, 'Timeout must be an integer greater than zero.'
      );
    });

    it('Should throw if "config.maxRetries" is not an integer greater than or equal to zero.', () => {
      const token = chance.hash();
      const maxRetries = chance.pickone([
        null,
        chance.hash(),
        chance.integer({ max: -1 }),
        chance.floating(),
        chance.bool(),
        { maxRetries: chance.integer({ min: 0 }) }
      ]);

      expect(() => new Workast(token, { maxRetries })).to.throw(
        WorkastInvalidParameterError, 'Max retries must be an integer greater than or equal to zero.'
      );
    });

    it('Should throw if "config.apiBaseUrl" is not a non-empty string', () => {
      const token = chance.hash();
      const apiBaseUrl = chance.pickone([
        null,
        '',
        chance.integer(),
        chance.bool(),
        { apiBaseUrl: chance.url() }
      ]);

      expect(() => new Workast(token, { apiBaseUrl })).to.throw(
        WorkastInvalidParameterError, 'API base URL must be a non-empty string.'
      );
    });

    it('Should throw if "config.authBaseUrl" is not a non-empty string', () => {
      const token = chance.hash();
      const authBaseUrl = chance.pickone([
        null,
        '',
        chance.integer(),
        chance.bool(),
        { authBaseUrl: chance.url() }
      ]);

      expect(() => new Workast(token, { authBaseUrl })).to.throw(
        WorkastInvalidParameterError, 'Auth base URL must be a non-empty string.'
      );
    });

    it(`Should have a default "timeout" of ${Workast.DEFAULT_TIMEOUT}`, () => {
      const workast = new Workast(chance.hash());
      expect(workast).to.have.nested.property('config.timeout', Workast.DEFAULT_TIMEOUT);
    });

    it(`Should have a default "maxRetries" of ${Workast.DEFAULT_MAX_RETRIES}`, () => {
      const workast = new Workast(chance.hash());
      expect(workast).to.have.nested.property('config.maxRetries', Workast.DEFAULT_MAX_RETRIES);
    });

    it(`Should have a default "apiBaseUrl" of ${Workast.DEFAULT_API_BASE_URL}`, () => {
      const workast = new Workast(chance.hash());
      expect(workast).to.have.nested.property('config.apiBaseUrl', Workast.DEFAULT_API_BASE_URL);
    });

    it(`Should have a default "authBaseUrl" of ${Workast.DEFAULT_AUTH_BASE_URL}`, () => {
      const workast = new Workast(chance.hash());
      expect(workast).to.have.nested.property('config.authBaseUrl', Workast.DEFAULT_AUTH_BASE_URL);
    });

    it('Should instantiate a SDK instance', () => {
      const token = chance.hash();
      const config = {
        timeout: chance.integer({ min: 1 }),
        maxRetries: chance.integer({ min: 0 }),
        apiBaseUrl: chance.url(),
        authBaseUrl: chance.url()
      };
      const workast = new Workast(token, config);
      expect(workast.config).to.deep.equal({ token, ...config });
    });
  });

  describe('#apiCall', () => {
    let token;
    let workast;

    before(() => {
      if (!nock.isActive()) {
        nock.activate();
      }

      token = chance.hash();
      workast = new Workast(token, {
        timeout: chance.integer({ min: 100, max: 200 }),
        maxRetries: 0,
        apiBaseUrl: chance.url(),
        authBaseUrl: chance.url()
      });
    });

    beforeEach(() => {
      nock.cleanAll();
    });

    after(() => {
      nock.cleanAll();
      nock.restore();
    });

    it('Should reject if "options.baseUrl" is not a non-empty string', async () => {
      const baseUrl = chance.pickone([
        null,
        '',
        chance.integer(),
        chance.bool(),
        { baseUrl: chance.url() }
      ]);

      await expect(workast.apiCall({ baseUrl })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Base URL must be a non-empty string.'
      );
    });

    it('Should reject if "options.timeout" is not an integer greater than zero', async () => {
      const timeout = chance.pickone([
        null,
        chance.hash(),
        chance.integer({ max: 0 }),
        chance.floating(),
        chance.bool(),
        { timeout: chance.integer({ min: 1 }) }
      ]);

      await expect(workast.apiCall({ timeout })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Timeout must be an integer greater than zero.'
      );
    });

    it('Should reject if "options.maxRetries" is not an integer greater than or equal to zero', async () => {
      const maxRetries = chance.pickone([
        null,
        chance.hash(),
        chance.integer({ max: -1 }),
        chance.floating(),
        chance.bool(),
        { maxRetries: chance.integer({ min: 0 }) }
      ]);

      await expect(workast.apiCall({ maxRetries })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Max retries must be an integer greater than or equal to zero.'
      );
    });

    it('Should reject if "options.method" is invalid', async () => {
      const method = chance.pickone([
        null,
        chance.word(),
        chance.integer(),
        chance.bool(),
        { method: chance.pickone(Workast.ALLOWED_HTTP_METHODS) }
      ]);

      await expect(workast.apiCall({ method })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, `Method must be one of ${Workast.ALLOWED_HTTP_METHODS.join(', ')}.`
      );
    });

    it('Should reject if "options.path" is not a string', async () => {
      const path = chance.pickone([
        null,
        chance.integer(),
        chance.floating(),
        chance.bool(),
        { path: chance.word() }
      ]);

      await expect(workast.apiCall({ path })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Path must be a string.'
      );
    });

    it('Should reject if "options.query" is not an object', async () => {
      const query = chance.pickone([
        null,
        chance.word(),
        chance.integer(),
        chance.floating(),
        chance.bool()
      ]);

      await expect(workast.apiCall({ query })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Query must be an object.'
      );
    });

    it('Should reject if "options.body" is not an object', async () => {
      const body = chance.pickone([
        null,
        chance.word(),
        chance.integer(),
        chance.floating(),
        chance.bool()
      ]);

      await expect(workast.apiCall({ body })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Body must be an object.'
      );
    });

    it('Should reject if "options.impersonate.team" is not a string', async () => {
      const team = chance.pickone([
        chance.integer({ min: 1 }),
        chance.floating(),
        true,
        { team: chance.word() }
      ]);

      await expect(workast.apiCall({ impersonate: { team } })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Impersonated team must be a string.'
      );
    });

    it('Should reject if "options.impersonate.user" is not a string', async () => {
      const user = chance.pickone([
        chance.integer({ min: 1 }),
        chance.floating(),
        true,
        { team: chance.word() }
      ]);

      await expect(workast.apiCall({ impersonate: { user } })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Impersonated user must be a string.'
      );
    });

    it('Should reject if "options.onProgress" is not a function', async () => {
      const onProgress = chance.pickone([
        chance.word(),
        chance.integer({ min: 1 }),
        true,
        { onProgress() {} }
      ]);

      await expect(workast.apiCall({ onProgress })).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Progress callback must be a function.'
      );
    });

    it('Should reject if there is a non 2xx response', async () => {
      const method = 'GET';
      const path = '/user/me';
      const statusCode = chance.pickone([400, 401, 402, 403, 404, 409, 422, 500, 503]);
      const responseBody = { error: { name: chance.word(), message: chance.sentence() } };

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(statusCode, responseBody);

      await expect(workast.apiCall({ method, path })).to.eventually.be.rejectedWith(WorkastHTTPError)
        .that.includes({
          message: responseBody.error.message,
          type: responseBody.error.name,
          statusCode
        });

      expect(scope.isDone()).to.be.true;
    });

    it('Should reject if the request times out', async () => {
      const method = 'GET';
      const path = '/user/me';
      const delay = workast.config.timeout + 1;

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .delay(delay)
        .reply(200, { id: chance.md5(), name: chance.name() });

      await expect(workast.apiCall({ method, path })).to.eventually.be.rejectedWith(WorkastHTTPError)
        .that.includes({
          message: `Request timed out after ${workast.config.timeout} ms`,
          type: 'RequestTimeoutError'
        });

      expect(scope.isDone()).to.be.true;
    });

    it('Should reject if there is a request error', async () => {
      const method = 'GET';
      const path = '/user/me';
      const errMsg = chance.sentence();
      const stub = sinon.stub(superagent.Request.prototype, 'query').throws(new Error(errMsg));

      await expect(workast.apiCall({ method, path })).to.eventually.be.rejectedWith(WorkastHTTPError)
        .that.includes({
          message: errMsg,
          type: 'RequestError'
        });

      stub.restore();
    });

    it('Should make a request impersonating a team', async () => {
      const method = 'GET';
      const path = '/user';
      const team = chance.hash();
      const responseBody = [{ id: chance.md5(), name: chance.name() }];

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .matchHeader(Workast.IMPERSONATE_TEAM_HEADER, team)
        .reply(200, responseBody);

      const users = await workast.apiCall({ method, path, impersonate: { team } });
      expect(users).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a request impersonating a user', async () => {
      const method = 'GET';
      const path = '/user/me';
      const user = chance.hash();
      const responseBody = { id: chance.md5(), name: chance.name() };

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .matchHeader(Workast.IMPERSONATE_USER_HEADER, user)
        .reply(200, responseBody);

      const userData = await workast.apiCall({ method, path, impersonate: { user } });
      expect(userData).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });

    it('Should resolve with "undefined" if response status is 204', async () => {
      const method = 'PATCH';
      const path = `/user/${chance.md5()}`;
      const requestBody = { avatar: chance.url({ extensions: ['gif', 'jpg', 'png'] }) };

      const scope = nock(workast.config.apiBaseUrl)
        .patch(path, requestBody)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .matchHeader('Content-Type', 'application/json')
        .reply(204);

      await expect(workast.apiCall({ method, path, body: requestBody })).to.eventually.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a GET to the root of the API base URL by default', async () => {
      const responseBody = { ip: chance.ip(), runningSince: chance.date() };

      const scope = nock(workast.config.apiBaseUrl)
        .get('/')
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(200, responseBody);

      const resData = await workast.apiCall();
      expect(resData).to.deep.equal(JSON.parse(JSON.stringify(responseBody)));
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a GET request', async () => {
      const method = 'GET';
      const path = '/user';
      const query = { role: 'admin', status: 'active' };
      const responseBody = [{ id: chance.md5(), name: chance.name() }];

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .query(query)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(200, responseBody);

      const users = await workast.apiCall({ method, path, query });
      expect(users).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a HEAD request', async () => {
      const method = 'HEAD';
      const path = `/list/${chance.hash()}/membership`;

      const scope = nock(workast.config.apiBaseUrl)
        .head(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(204);

      await expect(workast.apiCall({ method, path })).to.eventually.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a POST request', async () => {
      const method = 'POST';
      const path = `/task/${chance.md5()}/subtask`;
      const requestBody = { text: chance.sentence() };
      const responseBody = { id: chance.md5(), shortId: chance.word() };

      const scope = nock(workast.config.apiBaseUrl)
        .post(path, requestBody)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(201, responseBody);

      const newSubtask = await workast.apiCall({ method, path, body: requestBody });
      expect(newSubtask).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a PUT request', async () => {
      const method = 'PUT';
      const path = `/list/${chance.hash()}/platform`;
      const requestBody = {
        name: 'slack',
        details: {
          teamId: chance.hash(),
          channelId: chance.hash(),
          channelName: chance.name()
        }
      };

      const scope = nock(workast.config.apiBaseUrl)
        .put(path, requestBody)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(204);

      await expect(workast.apiCall({ method, path, body: requestBody })).to.eventually.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a DELETE request', async () => {
      const method = 'DELETE';
      const path = `/task/${chance.md5()}/tag`;
      const requestBody = { tags: [chance.hash(), chance.hash()] };

      const scope = nock(workast.config.apiBaseUrl)
        .delete(path, requestBody)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(204);

      await expect(workast.apiCall({ method, path, body: requestBody })).to.eventually.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a PATCH request', async () => {
      const method = 'PATCH';
      const path = `/user/${chance.md5()}/role`;
      const requestBody = { role: 'member' };

      const scope = nock(workast.config.apiBaseUrl)
        .patch(path, requestBody)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(204);

      await expect(workast.apiCall({ method, path, body: requestBody })).to.eventually.be.undefined;
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a POST request with multipart/form-data sending a file and extra data', async () => {
      const method = 'POST';
      const path = `/task/${chance.md5()}/attachment`;
      const requestBody = {
        file: Buffer.from('Text file content', 'utf-8'),
        description: chance.sentence()
      };
      const responseBody = { id: chance.hash() };

      const scope = nock(workast.config.apiBaseUrl)
        .post(path, (body) => Object.keys(requestBody).every((key) => body.includes(key)))
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', /^multipart\/form-data/)
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(201, responseBody);

      const newAttachment = await workast.apiCall({ method, path, body: requestBody });
      expect(newAttachment).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });

    it('Should make a POST request with multipart/form-data sending only a file', async () => {
      const method = 'POST';
      const path = `/task/${chance.md5()}/attachment`;
      const requestBody = { file: Buffer.from('Text file content', 'utf-8') };
      const responseBody = { id: chance.hash(), createdAt: chance.date() };

      const scope = nock(workast.config.apiBaseUrl)
        .post(path, (body) => body.includes('file'))
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', /^multipart\/form-data/)
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(201, responseBody);

      const newAttachment = await workast.apiCall({ method, path, body: requestBody });
      expect(newAttachment).to.deep.equal(JSON.parse(JSON.stringify(responseBody)));
      expect(scope.isDone()).to.be.true;
    });

    it('Should normalize the URL before making the request', async () => {
      const responseBody = { ok: true };
      const scope = nock('https://example.com')
        .get('/posts')
        .times(4)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(200, responseBody);

      // Case 1: The baseUrl does not end with a / and the path does not start with a /.
      let baseUrl = 'https://example.com';
      let path = 'posts';
      await expect(workast.apiCall({ baseUrl, path })).to.eventually.deep.equal(responseBody);

      // Case 2: The baseUrl ends with a / and the path starts with a /.
      baseUrl = 'https://example.com/';
      path = '/posts';
      await expect(workast.apiCall({ baseUrl, path })).to.eventually.deep.equal(responseBody);

      // Case 3: The baseUrl does not end with a / and the path starts with a /.
      baseUrl = 'https://example.com';
      path = '/posts';
      await expect(workast.apiCall({ baseUrl, path })).to.eventually.deep.equal(responseBody);

      // Case 4: The baseUrl ends with a / and the path does not start with a /.
      baseUrl = 'https://example.com/';
      path = 'posts';
      await expect(workast.apiCall({ baseUrl, path })).to.eventually.deep.equal(responseBody);

      expect(scope.isDone()).to.be.true;
    });

    it('Should call onProgress callback when uploading files', async () => {
      const method = 'POST';
      const path = `/task/${chance.md5()}/attachment`;
      const requestBody = { file: Buffer.from('Text file content', 'utf-8') };
      const responseBody = { id: chance.hash() };
      const onProgress = sinon.spy();

      const scope = nock(workast.config.apiBaseUrl)
        .post(path, (body) => body.includes('file'))
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', /^multipart\/form-data/)
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader(Workast.CLIENT_HEADER, Workast.CLIENT_NAME)
        .reply(201, responseBody);

      const newAttachment = await workast.apiCall({ method, path, body: requestBody, onProgress });
      expect(newAttachment).to.deep.equal(responseBody);
      expect(onProgress.called).to.be.true;
      expect(onProgress.lastCall.args[0]).to.deep.equal({
        direction: 'upload',
        lengthComputable: true,
        loaded: 216,
        total: 216
      });
      expect(scope.isDone()).to.be.true;
    });

    it('Should reject with the appropriate error if an error not related to superagent occurs', async () => {
      const scope = nock(workast.config.apiBaseUrl)
        .get('/user/fake')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .reply(200, {});

      await expect(workast.apiCall({ method: 'GET', path: '/user/me' }))
        .to.eventually.be.rejectedWith(WorkastHTTPError)
        .that.has.property('message')
        .that.matches(/^Nock: No match for request/);

      expect(scope.isDone()).to.be.false;
    });
  });

  describe('Resources', () => {
    let workast;

    before(() => {
      workast = new Workast(chance.hash());
    });

    it('Should reject if the number of provided args is less than the number of path params', async () => {
      await expect(workast.tasks.retrieve()).to.eventually.be.rejectedWith(
        WorkastInvalidParameterError, 'Missing URL params'
      );
    });

    it('Should perform a GET request without query params', async () => {
      const taskId = chance.hash();
      const taskDetails = { id: taskId, text: chance.sentence() };
      const stub = sinon.stub(workast, 'apiCall').resolves(taskDetails);

      await expect(workast.tasks.retrieve(taskId)).to.eventually.deep.equal(taskDetails);

      expect(stub.withArgs({
        method: 'GET',
        path: `${RESOURCE_PATH.TASK}/${taskId}`,
        query: undefined,
        body: undefined
      }).calledOnce).to.be.true;

      stub.restore();
    });

    it('Should perform a GET request with query params', async () => {
      const taskId = chance.hash();
      const result = { activities: [{ id: chance.hash() }, { id: chance.hash() }], total: 2 };
      const query = { type: ['comment'], limit: 10, sort: '-createdAt' };
      const stub = sinon.stub(workast, 'apiCall').resolves(result);

      await expect(workast.tasks.listActivity(taskId, query)).to.eventually.deep.equal(result);

      expect(stub.withArgs({
        method: 'GET',
        path: `${RESOURCE_PATH.TASK}/${taskId}/activity`,
        query,
        body: undefined
      }).calledOnce).to.be.true;

      stub.restore();
    });

    it('Should perform a GET request with options', async () => {
      const taskId = chance.hash();
      const taskDetails = { id: taskId, text: chance.sentence() };
      const options = { timeout: 5000, impersonate: { team: chance.md5(), user: chance.md5() } };
      const stub = sinon.stub(workast, 'apiCall').resolves(taskDetails);

      await expect(workast.tasks.retrieve(taskId, {}, options)).to.eventually.deep.equal(taskDetails);

      expect(stub.withArgs({
        method: 'GET',
        path: `${RESOURCE_PATH.TASK}/${taskId}`,
        query: {},
        body: undefined,
        ...options
      }).calledOnce).to.be.true;

      stub.restore();
    });

    it('Should perform a POST request without body', async () => {
      const taskId = chance.hash();
      const stub = sinon.stub(workast, 'apiCall').resolves(undefined);

      await expect(workast.tasks.restore(taskId)).to.eventually.be.undefined;

      expect(stub.withArgs({
        method: 'POST',
        path: `${RESOURCE_PATH.TASK}/${taskId}/restore`,
        query: undefined,
        body: undefined
      }).calledOnce).to.be.true;

      stub.restore();
    });

    it('Should perform a POST request with body', async () => {
      const body = {
        includeSubTasks: false,
        predicates: [
          { type: 'status', attribute: 'status', comparison: 'eq', value: 'pending' },
          { type: 'user', attribute: 'assignedTo', comparison: 'eq', value: chance.md5() }
        ],
        sort: [{ field: 'createdAt', direction: -1 }],
        expand: ['assignedTo', 'subscribers', 'tags', 'createdBy', 'parent', 'listId', 'doneBy'],
        limit: 50
      };
      const result = { tasks: [{ id: chance.hash() }, { id: chance.hash() }], total: 2, hiddenTasks: 0 };
      const stub = sinon.stub(workast, 'apiCall').resolves(result);

      await expect(workast.tasks.search(body)).to.eventually.deep.equal(result);

      expect(stub.withArgs({
        method: 'POST',
        path: `${RESOURCE_PATH.TASK}/search`,
        query: undefined,
        body
      }).calledOnce).to.be.true;

      stub.restore();
    });

    it('Should perform a POST request with options', async () => {
      const taskId = chance.hash();
      const body = { tags: [chance.hash()] };
      const options = {
        baseUrl: chance.url(), impersonate: { team: chance.md5(), user: chance.md5() }
      };
      const stub = sinon.stub(workast, 'apiCall').resolves(undefined);

      await expect(workast.tasks.addTags(taskId, body, options)).to.eventually.be.undefined;

      expect(stub.withArgs({
        method: 'POST',
        path: `${RESOURCE_PATH.TASK}/${taskId}/tag`,
        query: undefined,
        body,
        ...options
      }).calledOnce).to.be.true;

      stub.restore();
    });
  });
});
