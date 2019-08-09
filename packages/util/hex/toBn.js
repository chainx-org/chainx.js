'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = hexToBn;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _bn = _interopRequireDefault(require('bn.js'));

var _boolean = _interopRequireDefault(require('../is/boolean'));

var _stripPrefix = _interopRequireDefault(require('./stripPrefix'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function reverse(value) {
  return (value.match(new RegExp('.{1,2}', 'g')) || []).reverse().join('');
}
/**
 * @name hexToBn
 * @summary Creates a BN.js bignumber object from a hex string.
 * @description
 * `null` inputs returns a `BN(0)` result. Hex input values return the actual value converted to a BN. Anything that is not a hex string (including the `0x` prefix) throws an error.
 * @param _value The value to convert
 * @param _options Options to pass while converting
 * @param _options.isLe Convert using Little Endian
 * @param _options.isNegative Convert using two's complement
 * @example
 * <BR>
 *
 * ```javascript
 * import { hexToBn } from '@chainx/util';
 *
 * hexToBn('0x123480001f'); // => BN(0x123480001f)
 * ```
 */

function hexToBn(value) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          isLe: false,
          isNegative: false,
        };

  if (!value) {
    return new _bn.default(0);
  }

  const _options = (0, _objectSpread2.default)(
    {
      isLe: false,
      isNegative: false,
    },
    (0, _boolean.default)(options)
      ? {
          isLe: options,
        }
      : options
  );

  const _value = (0, _stripPrefix.default)(value); // FIXME: Use BN's 3rd argument `isLe` once this issue is fixed
  // https://github.com/indutny/bn.js/issues/208

  const bn = new _bn.default((_options.isLe ? reverse(_value) : _value) || '00', 16); // fromTwos takes as parameter the number of bits, which is the hex length
  // multiplied by 4.

  return _options.isNegative ? bn.fromTwos(_value.length * 4) : bn;
}
