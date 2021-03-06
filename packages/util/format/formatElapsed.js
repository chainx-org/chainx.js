'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = formatElapsed;

var _bn = _interopRequireDefault(require('bn.js'));

// Copyright 2017-2019 @polkadot/ui-util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function getValue(value) {
  if (value) {
    if (value.unwrap) {
      return getValue(value.unwrap());
    } else if (value instanceof Date) {
      return getValue(value.getTime());
    } else if (value instanceof _bn.default) {
      return getValue(value.toNumber());
    }
  }

  return value || 0;
}

function formatElapsed(now, value) {
  const tsNow = (now && now.getTime()) || 0;
  const tsValue = getValue(value);
  let display = '0.0s';

  if (tsNow && tsValue) {
    const elapsed = Math.max(Math.abs(tsNow - tsValue), 0) / 1000;

    if (elapsed < 15) {
      display = ''.concat(elapsed.toFixed(1), 's');
    } else if (elapsed < 60) {
      display = ''.concat(elapsed | 0, 's');
    } else if (elapsed < 3600) {
      display = ''.concat((elapsed / 60) | 0, 'm');
    } else {
      display = ''.concat((elapsed / 3600) | 0, 'h');
    }
  }

  return display;
}
