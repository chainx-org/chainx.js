'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isFunction;

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name isFunction
 * @summary Tests for a `function`.
 * @description
 * Checks to see if the input value is a JavaScript function.
 * @example
 * <BR>
 *
 * ```javascript
 * import { isFunction } from '@chainx/util';
 *
 * isFunction(() => false); // => true
 * ```
 */
function isFunction(value) {
  return typeof value === 'function';
}
