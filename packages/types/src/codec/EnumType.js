// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import {
  assert,
  hexToU8a,
  isHex,
  isNumber,
  isObject,
  isString,
  isU8a,
  isUndefined,
  u8aConcat,
  u8aToHex,
} from '@chainx/util';
import Null from '../Null';
import Base from './Base';
/**
 * @name Enum
 * @description
 * This implements an enum, that based on the value wraps a different type. It is effectively
 * an extension to enum where the value type is determined by the actual index.
 */
// TODO:
//   - As per Enum, actually use TS enum
//   - It should rather probably extend Enum instead of copying code
export default class Enum extends Base {
  constructor(def, value, index) {
    const defInfo = Enum.extractDef(def);
    const decoded = Enum.decodeEnum(defInfo.def, value, index);
    super(decoded.value);
    this._def = defInfo.def;
    this._isBasic = defInfo.isBasic;
    this._indexes = Object.keys(defInfo.def).map((_, index) => index);
    this._index = this._indexes.indexOf(decoded.index) || 0;
  }
  static extractDef(def) {
    if (!Array.isArray(def)) {
      return {
        def,
        isBasic: false,
      };
    }
    return {
      def: def.reduce((def, key) => {
        def[key] = Null;
        return def;
      }, {}),
      isBasic: true,
    };
  }
  static decodeEnum(def, value, index) {
    // If `index` is set, we parse it.
    if (index instanceof Enum) {
      return Enum.createValue(def, index._index, index.raw);
    } else if (isNumber(index)) {
      return Enum.createValue(def, index, value);
    }
    // Or else, we just look at `value`
    return Enum.decodeViaValue(def, value);
  }
  static decodeViaValue(def, value) {
    if (value instanceof Enum) {
      return Enum.createValue(def, value._index, value.raw);
    } else if (isU8a(value)) {
      return Enum.createValue(def, value[0], value.subarray(1));
    } else if (isNumber(value)) {
      return Enum.createValue(def, value);
    } else if (isString(value)) {
      const _str = value.toString();
      return isHex(_str) ? Enum.decodeViaValue(def, hexToU8a(_str)) : Enum.createViaJSON(def, _str);
    } else if (isObject(value)) {
      const key = Object.keys(value)[0];
      return Enum.createViaJSON(def, key, value[key]);
    }
    // Worst-case scenario, return the first with default
    return Enum.createValue(def, 0);
  }
  static createViaJSON(def, key, value) {
    // JSON comes in the form of { "<type (lowercased)>": "<value for type>" }, here we
    // additionally force to lower to ensure forward compat
    const keys = Object.keys(def).map(k => k.toLowerCase());
    const keyLower = key.toLowerCase();
    const index = keys.indexOf(keyLower);
    assert(index !== -1, `Cannot map Enum JSON, unable to find '${key}' in ${keys.join(', ')}`);
    return Enum.createValue(def, index, value);
  }
  static createValue(def, index = 0, value) {
    const Clazz = Object.values(def)[index];
    assert(!isUndefined(Clazz), `Unable to create Enum via index ${index}, in ${Object.keys(def).join(', ')}`);
    return {
      index,
      value: new Clazz(value),
    };
  }
  static with(Types) {
    return class extends Enum {
      constructor(value, index) {
        super(Types, value, index);
      }
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
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.isEmpty;
  }
  /**
   * @description Checks if the Enum points to a [[Null]] type
   */
  get isNone() {
    return this.isNull;
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
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    // cater for the case where we only pass the enum index
    if (isNumber(other)) {
      return this.toNumber() === other;
    } else if (this._isBasic && isString(other)) {
      return this.type === other;
    }
    // compare the actual wrapper value
    return this.value.eq(other);
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
    // this._index 改为 this.type
    return this._isBasic ? this.type : { [this.type]: this.raw.toJSON() };
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
    return this.isNull ? this.type : JSON.stringify(this.toJSON());
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
