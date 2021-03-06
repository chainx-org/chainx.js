'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isError;

var _instanceOf = _interopRequireDefault(require('./instanceOf'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name isError
 * @summary Tests for a `Error` object instance.
 * @description
 * Checks to see if the input object is an instance of `Error`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { isError } from '@chainx/util';
 *
 * console.log('isError', isError(new Error('message'))); // => true
 * ```
 */
function isError(value) {
  return (0, _instanceOf.default)(value, Error);
}
