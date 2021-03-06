'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = numberToHex;

var _fixLength = _interopRequireDefault(require('../hex/fixLength'));

var _null = _interopRequireDefault(require('../is/null'));

var _undefined = _interopRequireDefault(require('../is/undefined'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name numberToHex
 * @summary Creates a hex value from a number.
 * @description
 * `null`/`undefined`/`NaN` inputs returns an empty `0x` result. `number` input values return the actual bytes value converted to a `hex`. With `bitLength` set, it converts the number to the equivalent size.
 * @example
 * <BR>
 *
 * ```javascript
 * import { numberToHex } from '@chainx/util';
 *
 * numberToHex(0x1234); // => '0x1234'
 * numberToHex(0x1234, 32); // => 0x00001234
 * ```
 */
function numberToHex(value) {
  let bitLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  if ((0, _undefined.default)(value) || (0, _null.default)(value) || isNaN(value)) {
    return '0x';
  }

  return (0, _fixLength.default)((value || 0).toString(16), bitLength, true);
}
