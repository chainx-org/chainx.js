'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = naclEncrypt;

var _tweetnacl = _interopRequireDefault(require('tweetnacl'));

var _asU8a = _interopRequireDefault(require('../random/asU8a'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name naclEncrypt
 * @summary Encrypts a message using the supplied secretKey and nonce
 * @description
 * Returns an encrypted message, using the `secretKey` and `nonce`. If the `nonce` was not supplied, a random value is generated.
 * @example
 * <BR>
 *
 * ```javascript
 * import { naclEncrypt } from '@chainx/util-crypto';
 *
 * naclEncrypt([...], [...]); // => [...]
 * ```
 */
function naclEncrypt(message, secret) {
  let nonce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _asU8a.default)(24);
  return {
    encrypted: _tweetnacl.default.secretbox(message, nonce, secret),
    nonce,
  };
}
