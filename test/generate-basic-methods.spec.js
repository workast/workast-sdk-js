'use strict';

const { expect, chance } = require('./index');
const Workast = require('../src/workast');
const { generateBasicMethods, RESOURCE_PATH, BASIC_METHODS } = require('../src/resources/helpers');

describe('#generateBasicMethods', () => {
  let workast;
  let resourcePath;
  const allMethods = Object.values(BASIC_METHODS);

  before(() => {
    workast = new Workast(chance.hash());
    resourcePath = chance.pickone(Object.values(RESOURCE_PATH));
  });

  it('Should return all basic methods', () => {
    expect(generateBasicMethods(workast, resourcePath)).to.be.an('object')
      .that.has.all.keys(allMethods);
  });

  it('Should return only the specified methods', () => {
    const include = chance.pickset(allMethods, 3);

    expect(generateBasicMethods(workast, resourcePath, include)).to.be.an('object')
      .that.has.all.keys(include);
  });
});
