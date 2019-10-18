// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isU8a, isUndefined, u8aToHex, u8aToU8a } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
/**
 * @name U8a
 * @description
 * A basic wrapper around Uint8Array, with no frills and no fuss. It does differ
 * from other implementations where it will consume the full Uint8Array as passed to it.
 * As such it is meant to be subclassed where the wrapper takes care of the
 * actual lengths instead of used directly.
 * @noInheritDoc
 */
export default class U8a extends Uint8Array {
  constructor(value) {
    super(U8a.decodeU8a(value));
  }
  static decodeU8a(value) {
    if (isU8a(value)) {
      return value;
    }
    return u8aToU8a(value);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.length;
  }
  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return new U8a(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description Returns true if the type wraps an empty/default all-0 value
   */
  get isEmpty() {
    return !this.length || isUndefined(this.find(value => !!value));
  }
  /**
   * @description The length of the value
   */
  get length() {
    // only included here since we ignore inherited docs
    return super.length;
  }
  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.length * 8;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    if (other instanceof Uint8Array) {
      return this.length === other.length && !this.some((value, index) => value !== other[index]);
    }
    return this.eq(U8a.decodeU8a(other));
  }
  /**
   * @description Create a new subarray from the actual buffer. This is needed for compat reasons since a new Uint8Array gets returned here
   * @param begin The position to start at
   * @param end The position to end at
   */
  subarray(begin, end) {
    return Uint8Array.from(this).subarray(begin, end);
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return u8aToHex(this);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.toHex();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return '&[u8]';
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.toHex();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return Uint8Array.from(this);
  }
}
