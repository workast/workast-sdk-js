'use strict';

const { expect } = require('./index');
const Workast = require('../src/workast');

describe('Demo', () => {
  it('Should pass', () => {
    expect(Workast.DEFAULT_MAX_RETRIES).to.equal(0);
  });
});
