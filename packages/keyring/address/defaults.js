'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const defaults = {
  allowedDecodedLengths: [1, 2, 4, 8, 32],
  // publicKey has prefix + 2 checksum bytes, short only prefix + 1 checksum byte
  allowedEncodedLengths: [3, 4, 6, 10, 35],
  allowedPrefix: [0, 1, 3, 42, 43, 68, 69],
  prefix: 42,
};
var _default = defaults;
exports.default = _default;
