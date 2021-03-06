'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = encode;

var _bs = _interopRequireDefault(require('bs58'));

var _util = require('@chainx/util');

var _defaults = _interopRequireDefault(require('./defaults'));

var _sshash = _interopRequireDefault(require('./sshash'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Original implementation: https://github.com/paritytech/polka-ui/blob/4858c094684769080f5811f32b081dd7780b0880/src/polkadot.js#L34
function encode(_key) {
  let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defaults.default.prefix;
  const key = (0, _util.u8aToU8a)(_key);
  (0, _util.assert)(
    _defaults.default.allowedDecodedLengths.includes(key.length),
    'Expected a valid key to convert, with length '.concat(_defaults.default.allowedDecodedLengths)
  );
  const isPublicKey = key.length === 32;
  const input = (0, _util.u8aConcat)(new Uint8Array([prefix]), key);
  const hash = (0, _sshash.default)(input);
  return _bs.default.encode((0, _util.u8aToBuffer)((0, _util.u8aConcat)(input, hash.subarray(0, isPublicKey ? 2 : 1))));
}
