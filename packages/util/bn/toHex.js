'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = bnToHex;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _number = _interopRequireDefault(require('../is/number'));

var _toU8a = _interopRequireDefault(require('./toU8a'));

var _u8a = require('../u8a');

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const ZERO_STR = '0x00';

/**
 * @name bnToHex
 * @summary Creates a hex value from a BN.js bignumber object.
 * @description
 * `null` inputs returns a `0x` result, BN values return the actual value as a `0x` prefixed hex value. Anything that is not a BN object throws an error. With `bitLength` set, it fixes the number to the specified length.
 * @example
 * <BR>
 *
 * ```javascript
 * import BN from 'bn.js';
 * import { bnToHex } from '@chainx/util';
 *
 * bnToHex(new BN(0x123456)); // => '0x123456'
 * ```
 */
function bnToHex(value) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          bitLength: -1,
          isLe: false,
          isNegative: false,
        };

  if (!value) {
    return ZERO_STR;
  }

  const _options = (0, _objectSpread2.default)(
    {
      isLe: false,
      isNegative: false,
    },
    (0, _number.default)(options)
      ? {
          bitLength: options,
        }
      : options
  );

  return (0, _u8a.u8aToHex)((0, _toU8a.default)(value, _options));
}
