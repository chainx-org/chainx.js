'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = hash;

var _util = require('@chainx/util');

var _utilCrypto = require('@chainx/util-crypto');

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const SS58_PREFIX = (0, _util.stringToU8a)('SS58PRE');

function hash(key) {
  return (0, _utilCrypto.blake2AsU8a)((0, _util.u8aConcat)(SS58_PREFIX, key), 512);
}
