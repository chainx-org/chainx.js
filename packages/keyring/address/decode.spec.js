'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _testingPairs = _interopRequireDefault(require('../testingPairs'));

var _decode = _interopRequireDefault(require('./decode'));

// Copyright 2017-2019 @polkadot/keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @flow
describe('decode', () => {
  let keyring;
  beforeAll(async () => {
    keyring = (0, _testingPairs.default)({
      type: 'sr25519',
    });
  });
  it('decodes an address', () => {
    expect((0, _decode.default)('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')).toEqual(keyring.alice.publicKey());
  });
  it('converts a publicKey (u8a) as-is', () => {
    expect((0, _decode.default)(new Uint8Array([1, 2, 3]))).toEqual(new Uint8Array([1, 2, 3]));
  });
  it('converts a publicKey (hex) as-is', () => {
    expect((0, _decode.default)('0x01020304')).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
  it('decodes a short address', () => {
    expect((0, _decode.default)('F7NZ')).toEqual(new Uint8Array([1]));
  });
  it('decodes a 1-byte accountId (with prefix)', () => {
    expect((0, _decode.default)('PqtB', false, 68)).toEqual(new Uint8Array([1]));
  });
  it('decodes a 2-byte accountId', () => {
    expect((0, _decode.default)('2jpAFn', false, 68)).toEqual(new Uint8Array([0, 1]));
  });
  it('encodes a 4-byte address', () => {
    expect((0, _decode.default)('as7QnGMf', false, 68)).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
  it('decodes a 8-byte address', () => {
    expect((0, _decode.default)('4q7qY5RBG7Z4wv', false, 68)).toEqual(new Uint8Array([42, 44, 10, 0, 0, 0, 0, 0]));
  });
  it.skip('allows invalid prefix (in list)', () => {
    expect(() => (0, _decode.default)('6GfvWUvHvU8otbZ7sFhXH4eYeMcKdUkL61P3nFy52efEPVUx')).toThrow(/address prefix/);
  });
  it('fails when length is invalid', () => {
    expect(() => (0, _decode.default)('y9EMHt34JJo4rWLSaxoLGdYXvjgSXEd4zHUnQgfNzwES8b')).toThrow(/address length/);
  });
  it('fails when the checksum does not match', () => {
    expect(() => (0, _decode.default)('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMa9cj')).toThrow(/address checksum/);
    expect(() => (0, _decode.default)('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU')).toThrow(/address checksum/);
  });
});
