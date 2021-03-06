'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = decode;

var _util = require('@chainx/util');

var _utilCrypto = require('@chainx/util-crypto');

var _defaults = require('./defaults');

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const SEED_OFFSET = _defaults.PKCS8_HEADER.length;

function decode(passphrase, _encrypted) {
  (0, _util.assert)(_encrypted, 'No encrypted data available to decode');
  const encrypted = _encrypted;
  const encoded = passphrase
    ? (0, _utilCrypto.naclDecrypt)(
        encrypted.subarray(_defaults.NONCE_LENGTH),
        encrypted.subarray(0, _defaults.NONCE_LENGTH),
        (0, _util.u8aFixLength)((0, _util.stringToU8a)(passphrase), 256, true)
      )
    : encrypted;
  (0, _util.assert)(encoded, 'Unable to unencrypt using the supplied passphrase');
  const header = encoded.subarray(0, _defaults.PKCS8_HEADER.length);
  (0, _util.assert)(header.toString() === _defaults.PKCS8_HEADER.toString(), 'Invalid Pkcs8 header found in body');
  let secretKey = encoded.subarray(SEED_OFFSET, SEED_OFFSET + _defaults.SEC_LENGTH);
  let divOffset = SEED_OFFSET + _defaults.SEC_LENGTH;
  let divider = encoded.subarray(divOffset, divOffset + _defaults.PKCS8_DIVIDER.length); // old-style, we have the seed here

  if (divider.toString() !== _defaults.PKCS8_DIVIDER.toString()) {
    divOffset = SEED_OFFSET + _defaults.SEED_LENGTH;
    secretKey = encoded.subarray(SEED_OFFSET, divOffset);
    divider = encoded.subarray(divOffset, divOffset + _defaults.PKCS8_DIVIDER.length);
  }

  (0, _util.assert)(divider.toString() === _defaults.PKCS8_DIVIDER.toString(), 'Invalid Pkcs8 divider found in body');
  const pubOffset = divOffset + _defaults.PKCS8_DIVIDER.length;
  const publicKey = encoded.subarray(pubOffset, pubOffset + _defaults.PUB_LENGTH);
  return {
    publicKey,
    secretKey,
  };
}
