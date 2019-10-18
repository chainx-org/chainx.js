// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import BN from 'bn.js';
import { bnToBn, hexToBn, isHex, isString, isU8a, u8aToBn } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
import U8a from './U8a';
export const DEFAULT_UINT_BITS = 64;
/**
 * @name AbstractInt
 * @ignore
 * @noInheritDoc
 */
// TODO:
//   - Apart from encoding/decoding we don't actually keep check on the sizes, is this good enough?
export default class AbstractInt extends BN {
  constructor(isNegative, value = 0, bitLength = DEFAULT_UINT_BITS, isHexJson = true) {
    super(AbstractInt.decodeAbstracInt(value, bitLength, isNegative));
    this._bitLength = bitLength;
    this._isHexJson = isHexJson;
    this._isNegative = isNegative;
  }
  static decodeAbstracInt(value, bitLength, isNegative) {
    // This function returns a string, which will be passed in the BN
    // constructor. It would be ideal to actually return a BN, but there's a
    // bug: https://github.com/indutny/bn.js/issues/206.
    if (isHex(value, -1, true)) {
      return hexToBn(value, { isLe: false, isNegative }).toString();
    } else if (isU8a(value)) {
      return AbstractInt.decodeAbstracIntU8a(value, bitLength, isNegative);
    } else if (isString(value)) {
      return new BN(value, 10).toString();
    }
    return bnToBn(value).toString();
  }
  static decodeAbstracIntU8a(value, bitLength, isNegative) {
    if (!value.length) {
      return '0';
    }
    try {
      // NOTE When passing u8a in (typically from decoded data), it is always Little Endian
      return u8aToBn(value.subarray(0, bitLength / 8), { isLe: true, isNegative }).toString();
    } catch (error) {
      throw new Error(`AbstractInt: failed on ${JSON.stringify(value)}:: ${error.message}`);
    }
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this._bitLength / 8;
  }
  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return new U8a(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description Checks if the value is a zero value (align elsewhere)
   */
  get isEmpty() {
    return this.isZero();
  }
  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this._bitLength;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq(other) {
    // Here we are actually overriding the built-in .eq to take care of both
    // number and BN inputs (no `.eqn` needed) - numbers will be converted
    return super.eq(
      isHex(other) ? hexToBn(other.toString(), { isLe: false, isNegative: this._isNegative }) : bnToBn(other)
    );
  }
  /**
   * @description Returns the BN representation of the number. (Compatibility)
   */
  toBn() {
    return this;
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    // FIXME this return type should by string | number, but BN's return type
    // is string.
    // Maximum allowed integer for JS is 2^53 - 1, set limit at 52
    return this._isHexJson || super.bitLength() > 52 ? this.toHex() : this.toNumber();
  }
  /**
   * @description Returns the string representation of the value
   * @param base The base to use for the conversion
   */
  toString(base) {
    // only included here since we do not inherit docs
    return super.toString(base);
  }
}
