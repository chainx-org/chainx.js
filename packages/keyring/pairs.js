'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _util = require('@chainx/util');

var _decode = _interopRequireDefault(require('./address/decode'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
class Pairs {
  constructor() {
    this._map = void 0;
    this._map = {};
  }

  add(pair) {
    // @ts-ignore we use coercion :(
    this._map[pair.publicKey()] = pair;
    return pair;
  }

  all() {
    return Object.values(this._map);
  }

  get(address) {
    // @ts-ignore we use coercion :(
    const pair = this._map[(0, _decode.default)(address)];

    (0, _util.assert)(pair, () => {
      const formatted =
        (0, _util.isU8a)(address) || (0, _util.isHex)(address)
          ? (0, _util.u8aToHex)((0, _util.u8aToU8a)(address))
          : address;
      return "Unable to retrieve keypair '".concat(formatted, "'");
    });
    return pair;
  }

  remove(address) {
    // @ts-ignore we use coercion :(
    delete this._map[(0, _decode.default)(address)];
  }
}

exports.default = Pairs;
