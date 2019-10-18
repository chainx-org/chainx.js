// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isString, u8aToU8a } from '@chainx/util';
import U8a from './U8a';
/**
 * @name U8aFixed
 * @description
 * A U8a that manages a a sequence of bytes up to the specified bitLength. Not meant
 * to be used directly, rather is should be subclassed with the specific lengths.
 */
export default class U8aFixed extends U8a {
  constructor(value = new Uint8Array(), bitLength = 256) {
    super(U8aFixed.decodeU8aFixed(value, bitLength));
  }
  static decodeU8aFixed(value, bitLength) {
    if (Array.isArray(value) || isString(value)) {
      return U8aFixed.decodeU8aFixed(u8aToU8a(value), bitLength);
    }
    // ensure that we have an actual u8a with the full length as specified by
    // the bitLength input (padded with zeros as required)
    const byteLength = bitLength / 8;
    const sub = value.subarray(0, byteLength);
    if (sub.length === byteLength) {
      return sub;
    }
    const u8a = new Uint8Array(byteLength);
    u8a.set(sub, 0);
    return u8a;
  }
  static with(bitLength) {
    return class extends U8aFixed {
      constructor(value) {
        super(value, bitLength);
      }
    };
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `[u8;${this.length}]`;
  }
}
