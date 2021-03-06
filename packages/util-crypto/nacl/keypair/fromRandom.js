'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = naclKeypairFromRandom;

var _tweetnacl = _interopRequireDefault(require('tweetnacl'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name naclKeypairFromRandom
 * @summary Creates a new public/secret keypair.
 * @description
 * Returns a new generate object containing a `publicKey` & `secretKey`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclKeypairFromRandom } from '@chainx/util-crypto';
 *
 * naclKeypairFromRandom(); // => { secretKey: [...], publicKey: [...] }
 * ```
 */
function naclKeypairFromRandom() {
  return _tweetnacl.default.sign.keyPair();
}
