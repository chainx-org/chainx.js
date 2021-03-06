'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = xxhash64AsRaw;

var _asValue = _interopRequireDefault(require('./asValue'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name xxhash64AsRaw
 * @summary Creates a xxhash non-prefixed hex from the input.
 * @description
 * From either a `string`, `Uint8Array` or a `Buffer` input, create the xxhash and return the result as a non-prefixed hex string.
 * @example
 * <BR>
 *
 * ```javascript
 * import { xxhash64AsRaw } from '@chainx/util-crypto';
 *
 * xxhash64AsRaw('abcd', 0xabcd)); // => e29f70f8b8c96df7
 * ```
 */
function xxhash64AsRaw(data, seed) {
  return (0, _asValue.default)(data, seed).toString(16);
}
