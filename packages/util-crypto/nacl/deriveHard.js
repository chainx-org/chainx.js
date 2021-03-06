'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = deriveHard;

var _util = require('@chainx/util');

var _asU8a = _interopRequireDefault(require('../blake2/asU8a'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const HDKD = (0, _util.compactAddLength)((0, _util.stringToU8a)('Ed25519HDKD'));

function deriveHard(seed, chainCode) {
  return (0, _asU8a.default)((0, _util.u8aConcat)(HDKD, seed, chainCode));
}
