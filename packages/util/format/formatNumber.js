'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = formatNumber;

var _toBn = _interopRequireDefault(require('../bn/toBn'));

var _formatDecimal = _interopRequireDefault(require('./formatDecimal'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function formatNumber(_value) {
  if (!_value) {
    return '0';
  }

  const value = _value.toBn ? _value.toBn() : (0, _toBn.default)(_value);
  return (0, _formatDecimal.default)(value.toString());
}
