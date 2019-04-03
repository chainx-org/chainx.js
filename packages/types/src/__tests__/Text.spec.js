// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Text from '../Text';
import U8a from '../codec/U8a';
describe('Text', () => {
  it('length', () => {
    console.log(new Text('我我').length);
    console.log(new Text('我我').encodedLength, new Text('我我').toHex());
    console.log(new Text('wwww').encodedLength, new Text('wwww').toHex());
  });
  describe.skip('decode', () => {
    const testDecode = (type, input, expected) =>
      it(`can decode from ${type}`, () => {
        expect(new Text(input).toString()).toBe(expected);
      });
    testDecode('string', 'foo', 'foo');
    testDecode('Text', new Text('foo'), 'foo');
    testDecode('Uint8Array', Uint8Array.from([12, 102, 111, 111]), 'foo');
    testDecode('U8a', new U8a(Uint8Array.from([12, 102, 111, 111])), 'foo');
    testDecode(
      'object with `toString()`',
      {
        toString() {
          return 'foo';
        },
      },
      'foo'
    );
  });
  describe.skip('encode', () => {
    const testEncode = (to, expected) =>
      it(`can encode ${to}`, () => {
        expect(new Text('foo')[to]()).toEqual(expected);
      });
    testEncode('toHex', '0x0c666f6f');
    testEncode('toString', 'foo');
    testEncode('toU8a', Uint8Array.from([12, 102, 111, 111]));
  });
});
