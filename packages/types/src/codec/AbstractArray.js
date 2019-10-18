// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { u8aConcat, u8aToHex } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
import Compact from './Compact';
import U8a from './U8a';
import { compareArray } from './utils';
/**
 * @name AbstractArray
 * @description
 * This manages codec arrays. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 * @noInheritDoc
 */
export default class AbstractArray extends Array {
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.reduce((total, raw) => {
      return total + raw.encodedLength;
    }, Compact.encodeU8a(this.length).length);
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
    return this.length === 0;
  }
  /**
   * @description The length of the value
   */
  get length() {
    // only included here since we ignore inherited docs
    return super.length;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return compareArray(this, other);
  }
  /**
   * @description Converts the Object to an standard JavaScript Array
   */
  toArray() {
    return Array.from(this);
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return u8aToHex(this.toU8a());
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return this.map(entry => entry.toJSON());
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // Overwrite the default toString representation of Array.
    const data = this.map(entry => entry.toString());
    return `[${data.join(', ')}]`;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = this.map(entry => entry.toU8a(isBare));
    return isBare ? u8aConcat(...encoded) : u8aConcat(Compact.encodeU8a(this.length), ...encoded);
  }
  // Below are methods that we override. When we do a `new Vec(...).map()`,
  // we want it to return an Array. We only override the methods that return a
  // new instance.
  /**
   * @description Filters the array with the callback
   * @param callbackfn The filter function
   * @param thisArg The `this` object to apply the result to
   */
  filter(callbackfn, thisArg) {
    return this.toArray().filter(callbackfn, thisArg);
  }
  /**
   * @description Maps the array with the callback
   * @param callbackfn The mapping function
   * @param thisArg The `this` onject to apply the result to
   */
  map(callbackfn, thisArg) {
    return this.toArray().map(callbackfn, thisArg);
  }
  /**
   * @description Checks if the array includes a specific value
   */
  includes(check) {
    return this.some(value => value.eq(check));
  }
}
