'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = assert;

var _error = _interopRequireDefault(require('./ext/error'));

var _function = _interopRequireDefault(require('./is/function'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// No NaN type

/**
 * @name assert
 * @summary Checks for a valid test, if not ExtError is thrown.
 * @description
 * Checks that `test` is a truthy value. If value is falsy (`null`, `undefined`, `false`, ...), it throws an ExtError with the supplied `message` and an optional `code` and `data`. When `test` passes, `true` is returned.
 * @example
 * <BR>
 *
 * ```javascript
 * const { assert } from '@chainx/util';
 *
 * assert(true, 'True should be true'); // true returned
 * assert(false, 'False should not be true'); // ExtError thrown
 * assert(false, () => 'message'); // ExtError with 'message'
 * ```
 */
function assert(test, message) {
  let code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _error.default.CODES.ASSERT;
  let data = arguments.length > 3 ? arguments[3] : undefined;

  if (test) {
    return true;
  }

  if ((0, _function.default)(message)) {
    message = message();
  }

  throw new _error.default(message, code, data);
}
