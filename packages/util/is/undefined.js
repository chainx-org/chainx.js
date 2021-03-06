'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isUndefined;

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name isUndefined
 * @summary Tests for a `undefined` values.
 * @description
 * Checks to see if the input value is `undefined`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { isUndefined } from '@chainx/util';
 *
 * console.log('isUndefined', isUndefined(void(0))); // => true
 * ```
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}
