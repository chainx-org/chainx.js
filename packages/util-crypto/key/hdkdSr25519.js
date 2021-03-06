'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = keyHdkdSr25519;

var _deriveHard = _interopRequireDefault(require('../schnorrkel/deriveHard'));

var _deriveSoft = _interopRequireDefault(require('../schnorrkel/deriveSoft'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function keyHdkdSr25519(keypair, _ref) {
  let { chainCode, isSoft } = _ref;
  return isSoft ? (0, _deriveSoft.default)(keypair, chainCode) : (0, _deriveHard.default)(keypair, chainCode);
}
