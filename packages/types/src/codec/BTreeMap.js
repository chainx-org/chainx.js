// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isHex, hexToU8a, isU8a, u8aConcat, u8aToHex, u8aToU8a } from '@chainx/util';
import { blake2AsU8a } from '@chainx/util-crypto';
import Compact from './Compact';
import U8a from './U8a';
import U32 from '../U32';
import { compareMap, decodeU8a, typeToConstructor } from './utils';
export default class BTreeMap extends Map {
  constructor(keyType, valType, rawValue) {
    const KeyClass = typeToConstructor(keyType);
    const ValClass = typeToConstructor(valType);
    super(BTreeMap.decodeBTreeMap(KeyClass, ValClass, rawValue));
    this._KeyClass = KeyClass;
    this._ValClass = ValClass;
  }
  /**
   * Decode input to pass into constructor.
   *
   * @param KeyClass - Type of the map key
   * @param ValClass - Type of the map value
   * @param value - Value to decode, one of:
   * - null
   * - undefined
   * - hex
   * - Uint8Array
   * - Map<any, any>, where both key and value types are either
   *   constructors or decodeable values for their types.
   * @param jsonMap
   */
  static decodeBTreeMap(KeyClass, ValClass, value) {
    if (!value) {
      return new Map();
    } else if (isHex(value)) {
      return BTreeMap.decodeBTreeMap(KeyClass, ValClass, hexToU8a(value));
    } else if (isU8a(value)) {
      return BTreeMap.decodeBTreeMapFromU8a(KeyClass, ValClass, u8aToU8a(value));
    } else if (value instanceof Map) {
      return BTreeMap.decodeBTreeMapFromMap(KeyClass, ValClass, value);
    }
    throw new Error('BTreeMap: cannot decode type');
  }
  static decodeBTreeMapFromU8a(KeyClass, ValClass, u8a) {
    const output = new Map();
    const length = new U32(u8a).toNumber();
    const types = [];
    for (let i = 0; i < length; i++) {
      types.push(KeyClass, ValClass);
    }
    const values = decodeU8a(u8a.subarray(4), types);
    for (let i = 0; i < values.length; i += 2) {
      output.set(values[i], values[i + 1]);
    }
    return output;
  }
  static decodeBTreeMapFromMap(KeyClass, ValClass, value) {
    const output = new Map();
    value.forEach((v, k) => {
      let key, val;
      try {
        key = k instanceof KeyClass ? k : new KeyClass(k);
        val = v instanceof ValClass ? v : new ValClass(v);
      } catch (error) {
        console.error('Failed to decode BTreeMap key or value:', error.message);
        throw error;
      }
      output.set(key, val);
    });
    return output;
  }
  static with(keyType, valType) {
    return class extends BTreeMap {
      constructor(value) {
        super(keyType, valType, value);
      }
    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    let len = new U32(this.size).encodedLength;
    this.forEach((v, k) => {
      len += v.encodedLength + k.encodedLength;
    });
    return len;
  }
  /**
   * @description Returns a hash of the value
   */
  get hash() {
    return new U8a(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description Checks if the value is an empty value
   */
  get isEmpty() {
    return this.size === 0;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return compareMap(this, other);
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex() {
    return u8aToHex(this.toU8a());
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    const json = {};
    this.forEach((v, k) => {
      json[k.toString()] = v.toJSON();
    });
    return json;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `BTreeMap<${new this._KeyClass().toRawType()},${new this._ValClass().toRawType()}>`;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    const encoded = new Array();
    if (!isBare) {
      encoded.push(new U32(this.size).toU8a());
    }
    this.forEach((v, k) => {
      encoded.push(k.toU8a(isBare), v.toU8a(isBare));
    });
    return u8aConcat(...encoded);
  }
}
