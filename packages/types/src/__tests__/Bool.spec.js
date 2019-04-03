// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Bool from '../Bool';
describe('Bool', () => {
  describe('decode', () => {
    const testDecode = (type, input, expected) =>
      it(`can decode from ${type}`, () => {
        expect(new Bool(input).toJSON()).toBe(expected);
      });
    testDecode('Bool', new Bool(true), true);
    testDecode('Boolean', Boolean(true), true);
    testDecode('boolean', true, true);
    testDecode('number', 1, true);
    testDecode('Uint8Array', Uint8Array.from([1]), true);
  });
  describe('encode', () => {
    const testEncode = (to, expected) =>
      it(`can encode ${to}`, () => {
        expect(new Bool(true)[to]()).toEqual(expected);
      });
    testEncode('toJSON', true);
    testEncode('toHex', '0x01');
    testEncode('toString', 'true');
    testEncode('toU8a', Uint8Array.from([1]));
  });
  it('correctly encodes length', () => {
    expect(new Bool(true).encodedLength).toEqual(1);
  });
});
