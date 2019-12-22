'use strict';

/* eslint-disable import/no-extraneous-dependencies, no-console */

const nthline = require('nthline');
const { version: currentVersion } = require('../package.json');

(async () => {
  try {
    const lastVersionLine = await nthline(2, 'CHANGELOG.md');
    const now = new Date();
    const expectedVersionLine = `### ${currentVersion} - ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (lastVersionLine !== expectedVersionLine) {
      throw new Error(`Missing entry in CHANGELOG.md "${expectedVersionLine}"`);
    }
  } catch (err) {
    console.error(`Error in NPM version hook: ${err.message}`);
    process.exit(1);
  }
})();
