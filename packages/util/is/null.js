'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isNull;

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name isNull
 * @summary Tests for a `null` values.
 * @description
 * Checks to see if the input value is `null`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { isNull } from '@chainx/util';
 *
 * console.log('isNull', isNull(null)); // => true
 * ```
 */
function isNull(value) {
  return value === null;
}
