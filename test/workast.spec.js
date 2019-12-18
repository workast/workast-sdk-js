'use strict';

const superagent = require('superagent');
const { expect, chance, nock, sinon } = require('./index');
const Workast = require('../src/workast');
const { WorkastInvalidParameterError, WorkastHTTPError } = require('../src/errors');

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

    it('Should reject if there is a non 2xx response', async () => {
      const method = 'GET';
      const path = '/user/me';
      const statusCode = chance.pickone([400, 401, 402, 403, 404, 409, 422, 500, 503]);
      const responseBody = { error: { name: chance.word(), message: chance.sentence() } };

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader('Content-Type', 'application/json')
        .reply(statusCode, responseBody);

      await expect(workast.apiCall({ method, path })).to.eventually.be.rejectedWith(WorkastHTTPError)
        .that.includes({
          message: responseBody.error.message,
          type: responseBody.error.name,
          statusCode
        });

      expect(scope.isDone()).to.be.true;
    });

    // TODO: remove .skip once superagent bug has been fixed: https://github.com/visionmedia/superagent/issues/1488
    it.skip('Should reject if the request times out', async () => {
      const method = 'GET';
      const path = '/user/me';
      const delay = workast.config.timeout + 1;

      const scope = nock(workast.config.apiBaseUrl)
        .get(path)
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', `Bearer ${workast.config.token}`)
        .matchHeader('Content-Type', 'application/json')
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
      const stub = sinon.stub(superagent.Request.prototype, 'send').throws(new Error(errMsg));

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
        .matchHeader('Content-Type', 'application/json')
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
        .matchHeader('Content-Type', 'application/json')
        .matchHeader(Workast.IMPERSONATE_USER_HEADER, user)
        .reply(200, responseBody);

      const userData = await workast.apiCall({ method, path, impersonate: { user } });
      expect(userData).to.deep.equal(responseBody);
      expect(scope.isDone()).to.be.true;
    });
  });
});
