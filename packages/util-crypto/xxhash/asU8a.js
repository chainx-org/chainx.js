'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = xxhashAsU8a;

var _util = require('@chainx/util');

var _wasmCrypto = require('@chainx/wasm-crypto');

var _asBn = _interopRequireDefault(require('./xxhash64/asBn'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name xxhashAsU8a
 * @summary Creates a xxhash64 u8a from the input.
 * @description
 * From either a `string`, `Uint8Array` or a `Buffer` input, create the xxhash64 and return the result as a `Uint8Array` with the specified `bitLength`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { xxhashAsU8a } from '@chainx/util-crypto';
 *
 * xxhashAsU8a('abc'); // => 0x44bc2cf5ad770999
 * ```
 */
function xxhashAsU8a(data) {
  let bitLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
  const iterations = Math.ceil(bitLength / 64);

  if ((0, _wasmCrypto.isReady)()) {
    return (0, _wasmCrypto.twox)((0, _util.u8aToU8a)(data), iterations);
  }

  const u8a = new Uint8Array(Math.ceil(bitLength / 8));

  for (let seed = 0; seed < iterations; seed++) {
    u8a.set((0, _asBn.default)(data, seed).toArray('le', 8), seed * 8);
  }

  return u8a;
}
