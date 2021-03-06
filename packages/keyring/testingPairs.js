'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = testKeyringPairs;

var _testing = _interopRequireDefault(require('./testing'));

var _nobody = _interopRequireDefault(require('./pair/nobody'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function testKeyringPairs(options) {
  let isDerived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const keyring = (0, _testing.default)(options, isDerived);
  const pairs = keyring.getPairs();
  return pairs.reduce(
    (result, pair) => {
      const { name } = pair.getMeta();
      result[name] = pair;
      return result;
    },
    {
      nobody: (0, _nobody.default)(),
    }
  );
}
