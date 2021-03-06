'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = keyExtract;

var _util = require('@chainx/util');

var _extractPath = _interopRequireDefault(require('./extractPath'));

// Copyright 2017-2019 @polkadot/util-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const RE_CAPTURE = /^(\w+( \w+)*)((\/\/?[^\/]+)*)(\/\/\/(.*))?$/;
/**
 * @description Extracts the phrase, path and password from a SURI format for specifying secret keys `<secret>/<soft-key>//<hard-key>///<password>` (the `///password` may be omitted, and `/<soft-key>` and `//<hard-key>` maybe repeated and mixed).
 */

function keyExtract(suri) {
  const matches = suri.match(RE_CAPTURE);
  (0, _util.assert)(!(0, _util.isNull)(matches), "Unable to match '".concat(suri, "' to a secret URI"));
  const [, phrase, , derivePath, , , password] = matches;
  const { path } = (0, _extractPath.default)(derivePath);
  return {
    password,
    path,
    phrase,
  };
}
