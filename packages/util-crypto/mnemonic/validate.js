'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = mnemonicValidate;

require('../polyfill');

var _bip = require('bip39');

var _wasmCrypto = require('@chainx/wasm-crypto');

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name mnemonicValidate
 * @summary Validates a mnemonic input using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate, mnemonicValidate } from '@chainx/util-crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * const isValidMnemonic = mnemonicValidate(mnemonic); // => boolean
 * ```
 */
function mnemonicValidate(mnemonic) {
  return (0, _wasmCrypto.isReady)() ? (0, _wasmCrypto.bip39Validate)(mnemonic) : (0, _bip.validateMnemonic)(mnemonic);
}
