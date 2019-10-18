// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { blake2AsU8a } from '@chainx/util-crypto';
import U8a from './U8a';
/**
 * @name Base
 * @description A type extends the Base class, when it holds a value
 */
export default class Base {
  constructor(value) {
    this.raw = value;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toU8a().length;
  }
  /**
   * @description returns a hash of the contents
   */
  get hash() {
    return new U8a(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.raw.isEmpty;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return this.raw.eq(other);
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex(isLe) {
    return this.raw.toHex(isLe);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.raw.toJSON();
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.raw.toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return this.raw.toU8a(isBare);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return 'Base';
  }
}
