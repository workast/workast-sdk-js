'use strict';

const { expect, chance } = require('./index');
const { isNonEmptyString, isInteger, isFunction } = require('../src/utils');

describe('Utils', () => {
  describe('#isNonEmptyString', () => {
    it('Should return false if it is not a string', () => {
      const value = chance.pickone([
        null,
        undefined,
        chance.integer(),
        chance.floating(),
        chance.bool(),
        { notAString: true }
      ]);

      expect(isNonEmptyString(value)).to.be.false;
    });

    it('Should return false if it is an empty string', () => {
      expect(isNonEmptyString('')).to.be.false;
    });

    it('Should return true if it is a non empty string', () => {
      expect(isNonEmptyString(chance.sentence())).to.be.true;
    });
  });

  describe('#isInteger', () => {
    it('Should return false if it is not an integer', () => {
      const value = chance.pickone([
        null,
        undefined,
        chance.word(),
        chance.floating(),
        chance.bool(),
        { notAnInteger: true }
      ]);

      expect(isInteger(value)).to.be.false;
    });

    it('Should return false if it is less than min', () => {
      const value = chance.integer();
      expect(isInteger(value, { min: value + 1 })).to.be.false;
    });

    it('Should return false if it is greater than max', () => {
      const value = chance.integer();
      expect(isInteger(value, { max: value - 1 })).to.be.false;
    });

    it('Should return true if it is an integer and there is no min or max specified', () => {
      const value = chance.integer();
      expect(isInteger(value)).to.be.true;
    });

    it('Should return true if it is an integer within the specified range', () => {
      const value = chance.integer();
      expect(isInteger(value, { min: value - 1, max: value + 1 })).to.be.true;
    });
  });

  describe('#isFunction', () => {
    it('Should return false if value is not a function', () => {
      const value = chance.pickone([
        null,
        undefined,
        chance.integer(),
        chance.floating(),
        chance.sentence(),
        chance.bool(),
        { isFunction: false }
      ]);

      expect(isFunction(value)).to.be.false;
    });

    it('Should return true if value is a function', () => {
      const value = chance.pickone([
        () => {},
        async () => {},
        function* Any() {}, // eslint-disable-line no-empty-function
        class Any {},
        Math.round
      ]);

      expect(isFunction(value)).to.be.true;
    });
  });
});
