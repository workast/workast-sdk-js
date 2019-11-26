'use strict';

const { expect } = require('./index');
const Workast = require('../src/workast');

describe('Demo', () => {
  it('Should pass', () => {
    expect(Workast).to.be.a('function');
  });
});
