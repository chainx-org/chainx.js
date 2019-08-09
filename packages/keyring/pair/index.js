'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = createPair;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'));

var _utilCrypto = require('@chainx/util-crypto');

var _address = require('../address');

var _decode = _interopRequireDefault(require('./decode'));

var _encode = _interopRequireDefault(require('./encode'));

var _toJson2 = _interopRequireDefault(require('./toJson'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const isSr25519 = type => type === 'sr25519';

const fromSeed = (type, seed) =>
  isSr25519(type) ? (0, _utilCrypto.schnorrkelKeypairFromSeed)(seed) : (0, _utilCrypto.naclKeypairFromSeed)(seed);

const _sign = (type, message, pair) =>
  isSr25519(type) ? (0, _utilCrypto.schnorrkelSign)(message, pair) : (0, _utilCrypto.naclSign)(message, pair);

const _verify = (type, message, signature, publicKey) =>
  isSr25519(type)
    ? (0, _utilCrypto.schnorrkelVerify)(message, signature, publicKey)
    : (0, _utilCrypto.naclVerify)(message, signature, publicKey);
/**
 * @name pair
 * @summary Creates a keyring pair object
 * @description Creates a keyring pair object with provided account public key, metadata, and encoded arguments.
 * The keyring pair stores the account state including the encoded address and associated metadata.
 *
 * It has properties whose values are functions that may be called to perform account actions:
 *
 * - `address` function retrieves the address associated with the account.
 * - `decodedPkcs8` function is called with the account passphrase and account encoded public key.
 * It decodes the encoded public key using the passphrase provided to obtain the decoded account public key
 * and associated secret key that are then available in memory, and changes the account address stored in the
 * state of the pair to correspond to the address of the decoded public key.
 * - `encodePkcs8` function when provided with the correct passphrase associated with the account pair
 * and when the secret key is in memory (when the account pair is not locked) it returns an encoded
 * public key of the account.
 * - `getMeta` returns the metadata that is stored in the state of the pair, either when it was originally
 * created or set via `setMeta`.
 * - `publicKey` returns the public key stored in memory for the pair.
 * - `sign` may be used to return a signature by signing a provided message with the secret
 * key (if it is in memory) using Nacl.
 * - `toJson` calls another `toJson` function and provides the state of the pair,
 * it generates arguments to be passed to the other `toJson` function including an encoded public key of the account
 * that it generates using the secret key from memory (if it has been made available in memory)
 * and the optionally provided passphrase argument. It passes a third boolean argument to `toJson`
 * indicating whether the public key has been encoded or not (if a passphrase argument was provided then it is encoded).
 * The `toJson` function that it calls returns a JSON object with properties including the `address`
 * and `meta` that are assigned with the values stored in the corresponding state variables of the account pair,
 * an `encoded` property that is assigned with the encoded public key in hex format, and an `encoding`
 * property that indicates whether the public key value of the `encoded` property is encoded or not.
 */

function createPair(type, _ref) {
  let { publicKey: _publicKey, secretKey } = _ref;
  let meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let encoded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return {
    type,
    address: () => (0, _address.encodeAddress)(_publicKey),
    decodePkcs8: (passphrase, _encoded) => {
      const decoded = (0, _decode.default)(passphrase, _encoded || encoded);

      if (decoded.secretKey.length === 64) {
        _publicKey = decoded.publicKey;
        secretKey = decoded.secretKey;
      } else {
        const pair = fromSeed(type, decoded.secretKey);
        _publicKey = pair.publicKey;
        secretKey = pair.secretKey;
      }
    },
    encodePkcs8: passphrase =>
      (0, _encode.default)(
        {
          publicKey: _publicKey,
          secretKey,
        },
        passphrase
      ),
    getMeta: () => meta,
    isLocked: () => !secretKey || secretKey.length === 0,
    lock: () => {
      secretKey = new Uint8Array(0);
    },
    publicKey: () => _publicKey,
    setMeta: additional => {
      meta = (0, _objectSpread2.default)({}, meta, additional);
    },
    sign: message =>
      _sign(type, message, {
        publicKey: _publicKey,
        secretKey,
      }),
    toJson: passphrase =>
      (0, _toJson2.default)(
        type,
        {
          meta,
          publicKey: _publicKey,
        },
        (0, _encode.default)(
          {
            publicKey: _publicKey,
            secretKey,
          },
          passphrase
        ),
        !!passphrase
      ),
    verify: (message, signature) => _verify(type, message, signature, _publicKey),
  };
}
