'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = assertSingletonPackage;

var _undefined = _interopRequireDefault(require('./is/undefined'));

var _assert = _interopRequireDefault(require('./assert'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name assertSingletonPackage
 * @summary Checks that a specific package is only imported once
 */
function assertSingletonPackage(name) {
  // tslint:disable-next-line
  const _global = typeof window !== 'undefined' ? window : global;

  if (!_global.__polkadotjs) {
    _global.__polkadotjs = {};
  }

  (0, _assert.default)(
    (0, _undefined.default)(_global.__polkadotjs[name]),
    'Multiple versions of '.concat(name, ' detected, ensure that there is only version one in your dependency tree')
  );
  _global.__polkadotjs[name] = true;
}
