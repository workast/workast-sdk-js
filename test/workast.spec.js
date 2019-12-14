'use strict';

const { expect, chance } = require('./index');
const Workast = require('../src/workast');
const { WorkastInvalidParameterError } = require('../src/errors');

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
});
