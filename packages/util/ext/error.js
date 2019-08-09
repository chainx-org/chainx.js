'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _function = _interopRequireDefault(require('../is/function'));

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const UNKNOWN = -99999;

function extend(that, name, value) {
  Object.defineProperty(that, name, {
    configurable: true,
    enumerable: false,
    value,
  });
}
/**
 * @name ExtError
 * @summary Extension to the basic JS Error.
 * @description
 * The built-in JavaScript Error class is extended by adding a code to allow for Error categorization. In addition to the normal `stack`, `message`, the numeric `code` and `data` (any types) parameters are available on the object.
 * @example
 * <BR>
 *
 * ```javascript
 * const { ExtError } from '@chainx/util');
 *
 * throw new ExtError('some message', ExtError.CODES.METHOD_NOT_FOUND); // => error.code = -32601
 * ```
 */

class ExtError extends Error {
  // @ts-ignore we are assigning it via extend
  // @ts-ignore we are assigning it via extend
  // @ts-ignore we are assigning it via extend
  // @ts-ignore we are assigning it via extend
  // @ts-ignore we are assigning it via extend
  constructor() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : UNKNOWN;
    let data = arguments.length > 2 ? arguments[2] : undefined;
    super();
    this.code = void 0;
    this.data = void 0;
    this.message = void 0;
    this.name = void 0;
    this.stack = void 0;
    extend(this, 'message', String(message));
    extend(this, 'name', this.constructor.name);
    extend(this, 'data', data);
    extend(this, 'code', code);

    if ((0, _function.default)(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      extend(this, 'stack', new Error(message).stack);
    }
  }
}

exports.default = ExtError;
ExtError.CODES = {
  ASSERT: -90009,
  UNKNOWN,
  INVALID_JSONRPC: -99998,
  METHOD_NOT_FOUND: -32601, // Rust client
};
