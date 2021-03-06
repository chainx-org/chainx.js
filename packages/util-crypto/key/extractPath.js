'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = keyExtractPath;

var _DeriveJunction = _interopRequireDefault(require('./DeriveJunction'));

var _util = require('@chainx/util');

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const RE_JUNCTION = /\/(\/?)([^\/]+)/g;

/**
 * @description Extract derivation juntions from the supplied path
 */
function keyExtractPath(derivePath) {
  const parts = derivePath.match(RE_JUNCTION);
  const path = [];
  let constructed = '';

  if (parts) {
    constructed = parts.join('');
    parts.forEach(value => {
      path.push(_DeriveJunction.default.from(value.substr(1)));
    });
  }

  (0, _util.assert)(constructed === derivePath, 'Re-constructed path "'.concat(constructed, '" does not match input'));
  return {
    parts,
    path,
  };
}
