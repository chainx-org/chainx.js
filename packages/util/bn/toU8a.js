'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = bnToU8a;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _number = _interopRequireDefault(require('../is/number'));

var _toBn = _interopRequireDefault(require('./toBn'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function bnToU8a(value) {
  let arg1 =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          bitLength: -1,
          isLe: true,
          isNegative: false,
        };
  let arg2 = arguments.length > 2 ? arguments[2] : undefined;

  const _options = (0, _objectSpread2.default)(
    {
      isLe: true,
      isNegative: false,
      bitLength: -1,
    },
    (0, _number.default)(arg1)
      ? {
          bitLength: arg1,
          isLe: arg2,
        }
      : arg1
  );

  const valueBn = (0, _toBn.default)(value);
  let byteLength = _options.bitLength === -1 ? Math.ceil(valueBn.bitLength() / 8) : Math.ceil(_options.bitLength / 8);

  if (!value) {
    return _options.bitLength === -1 ? new Uint8Array([]) : new Uint8Array(byteLength);
  }

  const output = new Uint8Array(byteLength);
  const bn = _options.isNegative ? valueBn.toTwos(byteLength * 8) : valueBn;
  output.set(bn.toArray(_options.isLe ? 'le' : 'be', byteLength), 0);
  return output;
}
