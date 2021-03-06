'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = schnorrkelKeypairToU8a;

var _util = require('@chainx/util');

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function schnorrkelKeypairToU8a(_ref) {
  let { publicKey, secretKey } = _ref;
  return (0, _util.u8aConcat)(secretKey, publicKey).slice();
}
