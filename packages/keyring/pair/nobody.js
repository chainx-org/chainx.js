'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = everybody;

var _encode = _interopRequireDefault(require('../address/encode'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const _publicKey = new Uint8Array(32);

const _address = (0, _encode.default)(_publicKey);

const meta = {
  isTesting: true,
  name: 'nobody',
};
const json = {
  address: _address,
  encoded: '',
  encoding: {
    content: ['pkcs8', 'ed25519'],
    type: 'none',
    version: '0',
  },
  meta,
};

function everybody() {
  return {
    type: 'ed25519',
    address: () => _address,
    decodePkcs8: (passphrase, encoded) => undefined,
    encodePkcs8: passphrase => new Uint8Array(0),
    getMeta: () => meta,
    isLocked: () => true,
    lock: () => {
      // no locking, it is always locked
    },
    publicKey: () => _publicKey,
    setMeta: meta => undefined,
    sign: message => new Uint8Array(64),
    toJson: passphrase => json,
    verify: (message, signature) => false,
  };
}
