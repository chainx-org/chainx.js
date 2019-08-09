'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _encode = _interopRequireDefault(require('./encode'));

var _setPrefix = _interopRequireDefault(require('./setPrefix'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('setPrefix', () => {
  beforeEach(() => {
    (0, _setPrefix.default)(68);
  });
  it('sets and allows encoding using', () => {
    expect((0, _encode.default)(new Uint8Array([1]))).toEqual('PqtB');
  });
});
