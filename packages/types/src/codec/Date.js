// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import BN from 'bn.js';
import { bnToBn, bnToHex, bnToU8a, isString, isU8a, u8aToBn } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
import { createType } from './create';
const BITLENGTH = 64;
/**
 * @name Date
 * @description
 * A wrapper around seconds/timestamps. Internally the representation only has
 * second precicion (aligning with Rust), so any numbers passed an/out are always
 * per-second. For any encoding/decoding the 1000 multiplier would be applied to
 * get it in line with JavaScript formats. It extends the base JS `Date` object
 * and has all the methods available that are applicable to any `Date`
 * @noInheritDoc
 */
export default class CodecDate extends Date {
  constructor(value = 0) {
    super(CodecDate.decodeDate(value));
    this.raw = this;
  }
  static decodeDate(value) {
    if (value instanceof Date) {
      return value;
    } else if (isU8a(value)) {
      value = u8aToBn(value.subarray(0, BITLENGTH / 8), true);
    } else if (isString(value)) {
      value = new BN(value, 10, 'le');
    }
    return new Date(bnToBn(value).toNumber() * 1000);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return BITLENGTH / 8;
  }
  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return createType('Hash', blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.getTime() === 0;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return CodecDate.decodeDate(other).getTime() === this.getTime();
  }
  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return BITLENGTH;
  }
  /**
   * @description Returns the BN representation of the timestamp
   */
  toBn() {
    return new BN(this.toNumber());
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex(isLe = false) {
    return bnToHex(this.toBn(), {
      bitLength: BITLENGTH,
      isLe,
      isNegative: false,
    });
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    // FIXME Return type should be number, but conflicts with Date.toJSON()
    // which returns string
    return this.toNumber();
  }
  /**
   * @description Returns the number representation for the timestamp
   */
  toNumber() {
    return Math.ceil(this.getTime() / 1000);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Moment';
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // only included here since we do not inherit docs
    return super.toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return bnToU8a(this.toNumber(), BITLENGTH, true);
  }
}
