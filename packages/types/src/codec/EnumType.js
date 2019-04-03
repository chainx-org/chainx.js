// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, isNumber, isObject, isString, isU8a, u8aConcat, u8aToHex } from '@polkadot/util';
import Base from './Base';
import Null from '../Null';
/**
 * @name EnumType
 * @description
 * This implements an enum, that based on the value wraps a different type. It is effectively
 * an extension to enum where the value type is determined by the actual index.
 */
// TODO:
//   - As per Enum, actually use TS enum
//   - It should rather probably extend Enum instead of copying code
export default class EnumType extends Base {
  constructor(def, value, index) {
    const decoded = EnumType.decodeEnumType(def, value, index);
    super(decoded.value);
    this._def = def;
    this._indexes = Object.keys(def).map((_, index) => index);
    this._index = this._indexes.indexOf(decoded.index) || 0;
  }
  static decodeEnumType(def, value, index) {
    // If `index` is set, we parse it.
    if (index instanceof EnumType) {
      return EnumType.createValue(def, index._index, index.raw);
    } else if (isNumber(index)) {
      return EnumType.createValue(def, index, value);
    }
    // Or else, we just look at `value`
    return EnumType.decodeViaValue(def, value);
  }
  static decodeViaValue(def, value) {
    if (value instanceof EnumType) {
      return EnumType.createValue(def, value._index, value.raw);
    } else if (isU8a(value)) {
      return EnumType.createValue(def, value[0], value.subarray(1));
    } else if (isNumber(value)) {
      return EnumType.createValue(def, value);
    } else if (isString(value)) {
      return EnumType.createViaJSON(def, value.toString());
    } else if (isObject(value)) {
      const key = Object.keys(value)[0];
      return EnumType.createViaJSON(def, key, value[key]);
    }
    // Worst-case scenario, return the first with default
    return EnumType.createValue(def, 0);
  }
  static createViaJSON(def, key, value) {
    // JSON comes in the form of { "<type (lowercased)>": "<value for type>" }, here we
    // additionally force to lower to ensure forward compat
    const lowerKey = key.toLowerCase();
    const keys = Object.keys(def).map(k => k.toLowerCase());
    const index = keys.indexOf(lowerKey);
    assert(index !== -1, 'Unable to reliably map input on JSON');
    return EnumType.createValue(def, index, value);
  }
  static createValue(def, index, value) {
    return {
      index,
      value: new (Object.values(def))[index](value),
    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return 1 + this.raw.encodedLength;
  }
  /**
   * @description The index of the metadata value
   */
  get index() {
    return this._index;
  }
  /**
   * @description Checks if the Enum points to a [[Null]] type
   */
  get isNone() {
    return this.raw instanceof Null;
  }
  /**
   * @description Checks if the Enum points to a [[Null]] type (deprecated, use isNone)
   */
  get isNull() {
    return this.raw instanceof Null;
  }
  /**
   * @description The name of the type this enum value represents
   */
  get type() {
    return Object.keys(this._def)[this._index];
  }
  /**
   * @description The value of the enum
   */
  get value() {
    return this.raw;
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
    return this.raw && this.raw.toJSON ? this.raw.toJSON() : this.raw;
  }
  /**
   * @description Returns the number representation for the value
   */
  toNumber() {
    return this._index;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return this.type;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const index = this._indexes[this._index];
    return u8aConcat(new Uint8Array([index]), this.raw.toU8a(isBare));
  }
}
