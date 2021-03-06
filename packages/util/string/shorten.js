'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = stringShorten;

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name stringShorten
 * @summary Returns a string with maximum length
 * @description
 * Checks the string against the `prefixLength`, if longer than dopuble this, shortens it by placing `..` in the middle of it
 * @example
 * <BR>
 *
 * ```javascript
 * import { stringShorten } from '@chainx/util';
 *
 * stringShorten('1234567890', 2); // => 12..90
 * ```
 */
function stringShorten(_value) {
  let prefixLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  const value = ''.concat(_value);

  if (value.length <= 2 + 2 * prefixLength) {
    return value;
  }

  return ''.concat(value.substr(0, prefixLength), '..').concat(value.slice(-prefixLength));
}
