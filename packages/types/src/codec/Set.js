// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isU8a, isUndefined, u8aToHex } from '@chainx/util';
import Base from './Base';
/**
 * @name Set
 * @description
 * An Set is an array of string values, represented an an encoded type by
 * a bitwise representation of the values.
 */
// FIXME This is a prime candidate to extend the JavaScript built-in Set
export default class Set extends Base {
  constructor(setValues, value) {
    super(Set.decodeSet(setValues, value));
    this._setValues = setValues;
  }
  static decodeSet(setValues, value = 0) {
    if (isU8a(value)) {
      return Set.decodeSet(setValues, value[0]);
    } else if (Array.isArray(value)) {
      return value.reduce((result, value) => {
        if (isUndefined(setValues[value])) {
          console.error(`Ignoring invalid '${value}' passed to Set`);
        } else {
          result.push(value);
        }
        return result;
      }, []);
    }
    const result = Object.keys(setValues).reduce((result, key) => {
      if ((value & setValues[key]) === setValues[key]) {
        result.push(key);
      }
      return result;
    }, []);
    const computed = Set.encodeSet(setValues, result);
    if (value !== computed) {
      console.error(`Mismatch decoding '${value}', computed as '${computed}' with ${result}`);
    }
    return result;
  }
  static encodeSet(setValues, value) {
    return value.reduce((result, value) => {
      return result | (setValues[value] || 0);
    }, 0);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return 1;
  }
  /**
   * @description true is the Set contains no values
   */
  get isEmpty() {
    return this.values.length === 0;
  }
  /**
   * @description The actual set values as a Array<string>
   */
  get values() {
    return this.raw;
  }
  /**
   * @description The encoded value for the set members
   */
  get valueEncoded() {
    return Set.encodeSet(this._setValues, this.raw);
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
    return this.values;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return `[${this.values.join(', ')}]`;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return new Uint8Array([this.valueEncoded]);
  }
}
