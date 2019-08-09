'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _undefined = _interopRequireDefault(require('../is/undefined'));

var _si = require('./si');

var _formatDecimal = _interopRequireDefault(require('./formatDecimal'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const DEFAULT_DECIMALS = 0;
const DEFAULT_UNIT = _si.SI[_si.SI_MID].text;
let defaultDecimals = DEFAULT_DECIMALS;
let defaultUnit = DEFAULT_UNIT; // Formats a string/number with <prefix>.<postfix><type> notation

function _formatBalance(input) {
  let withSi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let decimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDecimals;
  const text = (input || '').toString();

  if (text.length === 0 || text === '0') {
    return '0';
  } // NOTE We start at midpoint (8) minus 1 - this means that values display as
  // 123.456 instead of 0.123k (so always 6 relevant). Additionally we us ceil
  // so there are at most 3 decimal before the decimal seperator

  const si = (0, _si.calcSi)(text, decimals);
  const mid = text.length - (decimals + si.power);
  const prefix = text.substr(0, mid);
  const postfix = ''.concat(text.substr(mid), '000').substr(0, 3);
  const units = withSi
    ? si.value === '-'
      ? ' '.concat(si.text)
      : ''.concat(si.value, ' ').concat(_si.SI[_si.SI_MID].text)
    : '';
  return ''
    .concat((0, _formatDecimal.default)(prefix || '0'), '.')
    .concat(postfix)
    .concat(units);
}

const formatBalance = _formatBalance;

formatBalance.calcSi = function(text) {
  let decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDecimals;
  return (0, _si.calcSi)(text, decimals);
};

formatBalance.findSi = _si.findSi;

formatBalance.getDefaults = () => {
  return {
    decimals: defaultDecimals,
    unit: defaultUnit,
  };
}; // get allowable options to display in a dropdown

formatBalance.getOptions = function() {
  let decimals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultDecimals;
  return _si.SI.filter(_ref => {
    let { power } = _ref;
    return power < 0 ? decimals + power >= 0 : true;
  });
}; // Sets the default decimals to use for formatting (ui-wide)

formatBalance.setDefaults = _ref2 => {
  let { decimals, unit } = _ref2;
  defaultDecimals = (0, _undefined.default)(decimals) ? defaultDecimals : decimals;
  defaultUnit = (0, _undefined.default)(unit) ? defaultUnit : unit;
  _si.SI[_si.SI_MID].text = defaultUnit;
};

var _default = formatBalance;
exports.default = _default;
