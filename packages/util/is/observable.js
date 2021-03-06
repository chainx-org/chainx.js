'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isObservable;

var _function = _interopRequireDefault(require('./function'));

var _object = _interopRequireDefault(require('./object'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name isBObservable
 * @summary Tests for a `Observable` object instance.
 * @description
 * Checks to see if the input object is an instance of `BN` (bn.js).
 * @example
 * <BR>
 *
 * ```javascript
 * import { isObservable } from '@chainx/util';
 *
 * console.log('isObservable', isObservable(...));
 * ```
 */
function isObservable(value) {
  return (0, _object.default)(value) && (0, _function.default)(value.next);
}
