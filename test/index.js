'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chance = require('chance').Chance();

chai.use(chaiAsPromised);

module.exports = {
  expect: chai.expect,
  chance
};
