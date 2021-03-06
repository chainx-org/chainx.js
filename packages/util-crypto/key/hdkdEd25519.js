'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = keyHdkdEd25519;

var _util = require('@chainx/util');

var _deriveHard = _interopRequireDefault(require('../nacl/deriveHard'));

var _fromSeed = _interopRequireDefault(require('../nacl/keypair/fromSeed'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function keyHdkdEd25519(keypair, _ref) {
  let { chainCode, isHard } = _ref;
  (0, _util.assert)(isHard, 'A soft key was found in the path (and is unsupported)');
  return (0, _fromSeed.default)((0, _deriveHard.default)(keypair.secretKey.subarray(0, 32), chainCode));
}
