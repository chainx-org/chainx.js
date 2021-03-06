'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = sha512AsU8a;

var _tweetnacl = _interopRequireDefault(require('tweetnacl'));

var _wasmCrypto = require('@chainx/wasm-crypto');

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name sha512AsU8a
 * @summary Creates sha-512 hash of the input.
 * @description
 * Returns a sha-512 `Uint8Array` from the supplied data.
 * @example
 * <BR>
 *
 * ```javascript
 * import { sha512AsU8a } from '@chainx/util-crypto';
 *
 * sha512AsU8a(Uint8Array.from([...])); // => Uint8Array([...])
 * ```
 */
function sha512AsU8a(data) {
  return (0, _wasmCrypto.isReady)() ? (0, _wasmCrypto.sha512)(data) : _tweetnacl.default.hash(data);
}
