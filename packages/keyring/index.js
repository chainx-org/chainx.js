'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'decodeAddress', {
  enumerable: true,
  get: function get() {
    return _address.decodeAddress;
  },
});
Object.defineProperty(exports, 'encodeAddress', {
  enumerable: true,
  get: function get() {
    return _address.encodeAddress;
  },
});
Object.defineProperty(exports, 'setAddressPrefix', {
  enumerable: true,
  get: function get() {
    return _address.setAddressPrefix;
  },
});
Object.defineProperty(exports, 'Keyring', {
  enumerable: true,
  get: function get() {
    return _keyring.default;
  },
});
exports.default = void 0;

var _util = require('@chainx/util');

var _address = require('./address');

var _keyring = _interopRequireDefault(require('./keyring'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
(0, _util.assertSingletonPackage)('@chainx/keyring');
var _default = _keyring.default;
exports.default = _default;
