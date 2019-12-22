'use strict';

/* eslint-disable import/no-extraneous-dependencies, no-console */

const nthline = require('nthline');
const path = require('path');
const { version: currentVersion } = require('../package.json');

(async () => {
  try {
    const lastVersionLine = await nthline(2, path.resolve(__dirname, 'CHANGELOG.md'));
    const now = new Date();
    const expectedVersionLine = `### ${currentVersion} - ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    console.log(`Last version in CHANGELOG.md is: "${lastVersionLine}"`);

    if (lastVersionLine !== expectedVersionLine) {
      throw new Error(`Missing entry in CHANGELOG.md "${expectedVersionLine}"`);
    }
  } catch (err) {
    console.error(`Error in NPM version hook: ${err.message}`);
    process.exit(1);
  }
})();
