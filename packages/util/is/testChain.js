'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = isTestChain;
// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const re = new RegExp('^(Development|Local Testnet)$');

function isTestChain(chain) {
  if (!chain) {
    return false;
  }

  return !!re.test(chain.toString());
}
