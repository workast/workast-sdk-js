'use strict';

const { expect } = require('./index');
const workastSdk = require('../src/workast-sdk');

describe('Demo', () => {
  it('Should pass', () => {
    expect(workastSdk).to.deep.equal({});
  });
});