'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = arrayFilter;

var _null = _interopRequireDefault(require('../is/null'));

var _undefined = _interopRequireDefault(require('../is/undefined'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name arrayFilter
 * @summary Filters undefined and (optionally) null values from an array
 * @description
 * Returns a new array with all `undefined` values removed. Optionally, when `allowNulls = false`, it removes the `null` values as well
 * @example
 * <BR>
 *
 * ```javascript
 * import { arrayFilter } from '@chainx/util';
 *
 * arrayFilter([0, void 0, true, null, false, '']); // [0, true, null, false, '']
 * arrayFilter([0, void 0, true, null, false, ''], false); // [0, true, false, '']
 * ```
 */
function arrayFilter(array) {
  let allowNulls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return array.filter(value => {
    return !(0, _undefined.default)(value) && (allowNulls || !(0, _null.default)(value));
  });
}
