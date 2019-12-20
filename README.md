# Workast SDK

[![npm version](https://img.shields.io/npm/v/@workast/sdk?color=blue)](https://www.npmjs.com/package/@workast/sdk)
[![Build Status](https://travis-ci.org/workast/workast-sdk-js.svg?branch=master)](https://travis-ci.org/workast/workast-sdk-js)
[![Coverage Status](https://coveralls.io/repos/github/workast/workast-sdk-js/badge.svg?branch=master)](https://coveralls.io/github/workast/workast-sdk-js?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/workast/workast-sdk-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/workast/workast-sdk-js?targetFile=package.json)
[![dependencies Status](https://david-dm.org/workast/workast-sdk-js/status.svg)](https://david-dm.org/workast/workast-sdk-js)
[![devDependencies Status](https://david-dm.org/workast/workast-sdk-js/dev-status.svg)](https://david-dm.org/workast/workast-sdk-js?type=dev)

Workast SDK for JavaScript in the browser and Node.js

![Workast Logo](https://cdn.workast.io/workast-logo.png "Workast")

## Table of contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Releases](CHANGELOG.md)
- [Responsible disclosure](#responsible-disclosure)

## Prerequisites
We use [browserslist](https://github.com/browserslist/browserslist) to handle our supported versions for both node and browsers. [You can see the updated list here.](https://browserl.ist/?q=%3E+1%25%2C+last+2+versions%2C+not+dead%2C+maintained+node+versions)

## Installation
Using NPM:
```bash
$ npm install @workast/sdk --save
```
Using Yarn:
```bash
$ yarn add @workast/sdk
```

## Usage

### Node
```
'use strict';

const Workast = require('@workast/sdk');

const workast = new Workast('<your_workast_token>');

try {
  const myData = await workast.apiCall({ path: '/user/me' });
  console.log('My data: %O', myData);
} catch (err) {
  console.error('Something went wrong: %O', err);
}
```

### React
```
import Workast from '@workast/sdk';

const workast = new Workast('<your_workast_token>');

try {
  const myData = await workast.apiCall({ path: '/user/me' });
  console.log('My data: %O', myData);
} catch (err) {
  console.error('Something went wrong: %O', err);
}
```

### HTML
```
<script src="https://unpkg.com/@workast/sdk@<version>/dist/workast.min.js"></script>
<script>
  var workast = new Workast('<your_workast_token>');

  workast
    .apiCall({
      path: 'user/me'
    })
    .then(function(myData) {
      console.log('My data: %O', myData);
    })
    .catch(function(err) {
      console.error('Something went wrong: %O', err);
    });
</script>
```

## Responsible disclosure
If you have any security issue to report, contact project maintainers privately at [tech@workast.io](mailto:tech@workast.io?subject=[workast-sdk-js]%20Issue).
