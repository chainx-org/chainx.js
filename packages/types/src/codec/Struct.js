// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { hexToU8a, isHex, isObject, isU8a, u8aConcat, u8aToHex } from '@polkadot/util';
import decodeU8a from './utils/decodeU8a';
/**
 * @name Struct
 * @description
 * A Struct defines an Object with key/values - where the values are Codec values. It removes
 * a lot of repetition from the actual coding, define a structure type, pass it the key/Codec
 * values in the constructor and it manages the decoding. It is important that the constructor
 * values matches 100% to the order in th Rust code, i.e. don't go crazy and make it alphabetical,
 * it needs to decoded in the specific defined order.
 * @noInheritDoc
 */
export default class Struct extends Map {
  constructor(Types, value = {}, jsonMap = new Map()) {
    const decoded = Struct.decodeStruct(Types, value, jsonMap);
    super(Object.entries(decoded));
    this._jsonMap = jsonMap;
    this._Types = Object.keys(Types).reduce((result, key) => {
      result[key] = Types[key].name;
      return result;
    }, {});
  }
  /**
   * Decode input to pass into constructor.
   *
   * @param Types - Types definition.
   * @param value - Value to decode, one of:
   * - null
   * - undefined
   * - hex
   * - Uint8Array
   * - object with `{ key1: value1, key2: value2 }`, assuming `key1` and `key2`
   * are also keys in `Types`
   * - array with `[value1, value2]` assuming the array has the same length as
   * `Object.keys(Types)`
   * @param jsonMap
   */
  static decodeStruct(Types, value, jsonMap) {
    // l.debug(() => ['Struct.decode', { Types, value }]);
    if (isHex(value)) {
      return Struct.decodeStruct(Types, hexToU8a(value), jsonMap);
    } else if (isU8a(value)) {
      const values = decodeU8a(value, Object.values(Types));
      // Transform array of values to {key: value} mapping
      return Object.keys(Types).reduce((raw, key, index) => {
        raw[key] = values[index];
        return raw;
      }, {});
    } else if (!value) {
      return {};
    }
    // We assume from here that value is a JS object (Array, Map, Object)
    return Struct.decodeStructFromObject(Types, value, jsonMap);
  }
  static decodeStructFromObject(Types, value, jsonMap) {
    return Object.keys(Types).reduce((raw, key, index) => {
      // The key in the JSON can be snake_case (or other cases), but in our
      // Types, result or any other maps, it's camelCase
      const jsonKey = jsonMap.get(key) && !value[key] ? jsonMap.get(key) : key;
      if (Array.isArray(value)) {
        if (!Types[key]) {
          throw new Error(`Struct: cannot find type of value ${key}`);
        }
        raw[key] = value[index] instanceof Types[key] ? value[index] : new Types[key](value[index]);
      } else if (value instanceof Map) {
        const mapped = value.get(jsonKey);
        raw[key] = mapped instanceof Types[key] ? mapped : new Types[key](mapped);
      } else if (isObject(value)) {
        raw[key] = value[jsonKey] instanceof Types[key] ? value[jsonKey] : new Types[key](value[jsonKey]);
      } else {
        throw new Error(`Struct: cannot decode type ${Types[key].name} with value ${JSON.stringify(value)}`);
      }
      return raw;
    }, {});
  }
  static with(Types) {
    return class Struct extends Struct {
      constructor(value, jsonMap) {
        super(Types, value, jsonMap);
        Object.keys(Types).forEach(key => {
          Object.defineProperty(this, key, {
            enumerable: true,
            get: () => this.get(key),
          });
        });
      }
    };
  }
  /**
   * @description Returns the Type description to sthe structure
   */
  get Type() {
    return this._Types;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toArray().reduce((length, entry) => {
      return (length += entry.encodedLength);
    }, 0);
  }
  /**
   * @description Returns a specific names entry in the structure
   * @param name The name of the entry to retrieve
   */
  get(name) {
    return super.get(name);
  }
  /**
   * @description Returns the values of a member at a specific index (Rather use get(name) for performance)
   */
  getAtIndex(index) {
    return this.toArray()[index];
  }
  /**
   * @description Converts the Object to an standard JavaScript Array
   */
  toArray() {
    return [...this.values()];
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
    return [...this.keys()].reduce((json, key) => {
      const jsonKey = this._jsonMap.get(key) || key;
      const value = this.get(key);
      json[jsonKey] = value && value.toJSON();
      return json;
    }, {});
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return u8aConcat(...this.toArray().map(entry => entry.toU8a(isBare)));
  }
}
