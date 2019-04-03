// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isString, isU8a, u8aToU8a } from '@polkadot/util';
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
  static decodeU8aFixed(value, bitLength = 256) {
    if (isU8a(value)) {
      return value.subarray(0, bitLength / 8);
    } else if (Array.isArray(value) || isString(value)) {
      return U8aFixed.decodeU8aFixed(u8aToU8a(value), bitLength);
    }
    return value;
  }
  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.length * 8;
  }
}
