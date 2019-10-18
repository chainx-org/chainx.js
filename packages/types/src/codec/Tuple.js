// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isU8a, u8aConcat, isHex, hexToU8a } from '@chainx/util';
import { decodeU8a, mapToTypeMap, typeToConstructor } from './utils';
import AbstractArray from './AbstractArray';
/**
 * @name Tuple
 * @description
 * A Tuple defines an anonymous fixed-length array, where each element has its
 * own type. It extends the base JS `Array` object.
 */
export default class Tuple extends AbstractArray {
  constructor(Types, value) {
    const Clazzes = Array.isArray(Types) ? Types.map(type => typeToConstructor(type)) : mapToTypeMap(Types);
    super(...Tuple.decodeTuple(Clazzes, value));
    this._Types = Clazzes;
  }
  static decodeTuple(_Types, value) {
    if (isU8a(value)) {
      return decodeU8a(value, _Types);
    } else if (isHex(value)) {
      return Tuple.decodeTuple(_Types, hexToU8a(value));
    }
    const Types = Array.isArray(_Types) ? _Types : Object.values(_Types);
    return Types.map((Type, index) => {
      try {
        return new Type(value && value[index]);
      } catch (error) {
        throw new Error(`Tuple: failed on ${index}:: ${error.message}`);
      }
    });
  }
  static with(Types) {
    return class extends Tuple {
      constructor(value) {
        super(Types, value);
      }
    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.reduce((length, entry) => {
      length += entry.encodedLength;
      return length;
    }, 0);
  }
  /**
   * @description The types definition of the tuple
   */
  get Types() {
    return Array.isArray(this._Types) ? this._Types.map(Type => new Type().toRawType()) : Object.keys(this._Types);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    const types = (Array.isArray(this._Types) ? this._Types : Object.values(this._Types)).map(Type =>
      new Type().toRawType()
    );
    return `(${types.join(',')})`;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // Overwrite the default toString representation of Array.
    return JSON.stringify(this.toJSON());
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return u8aConcat(...this.map(entry => entry.toU8a(isBare)));
  }
}
