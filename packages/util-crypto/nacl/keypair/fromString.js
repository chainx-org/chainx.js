'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = naclKeypairFromString;

var _util = require('@chainx/util');

var _asU8a = _interopRequireDefault(require('../../blake2/asU8a'));

var _fromSeed = _interopRequireDefault(require('./fromSeed'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name naclKeypairFromString
 * @summary Creates a new public/secret keypair from a string.
 * @description
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied string. The string is hashed and the value used as the input seed.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclKeypairFromString } from '@chainx/util-crypto';
 *
 * naclKeypairFromString('test'); // => { secretKey: [...], publicKey: [...] }
 * ```
 */
function naclKeypairFromString(value) {
  return (0, _fromSeed.default)((0, _asU8a.default)((0, _util.stringToU8a)(value), 256));
}
