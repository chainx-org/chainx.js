'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = xxhash64AsValue;

var _xxhashjs = _interopRequireDefault(require('xxhashjs'));

var _util = require('@chainx/util');

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name xxhash64AsValue
 * @summary Creates a hex number from the input.
 * @description
 * From either a `string`, `Uint8Array` or a `Buffer` input, create the xxhash and return the result as a hex number
 * @example
 * <BR>
 *
 * ```javascript
 * import { xxhash64AsValue } from '@chainx/util-crypto';
 *
 * xxhash64AsValue('abcd', 0xabcd)); // => e29f70f8b8c96df7
 * ```
 */
function xxhash64AsValue(data, seed) {
  if ((0, _util.isBuffer)(data) || (0, _util.isString)(data)) {
    // @ts-ignore Buffer is ArrayBuffer underlying
    return _xxhashjs.default.h64(data, seed);
  } // @ts-ignore conversion works, yields correct result

  return _xxhashjs.default.h64((0, _util.u8aToBuffer)(data), seed);
}
