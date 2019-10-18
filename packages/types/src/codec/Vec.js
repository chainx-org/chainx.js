import { u8aToU8a, assert } from '@chainx/util';
import Compact from './Compact';
import { decodeU8a, typeToConstructor } from './utils';
import AbstractArray from './AbstractArray';
const MAX_LENGTH = 32768;

export default class Vec extends AbstractArray {
  constructor(Type, value = []) {
    const Clazz = typeToConstructor(Type);
    super(...Vec.decodeVec(Clazz, value));
    this._Type = Clazz;
  }
  static decodeVec(Type, value) {
    if (Array.isArray(value)) {
      return value.map((entry, index) => {
        try {
          return entry instanceof Type ? entry : new Type(entry);
        } catch (error) {
          console.error(`Unable to decode Vec on index ${index}`, error.message);
          throw error;
        }
      });
    }
    const u8a = u8aToU8a(value);
    const [offset, length] = Compact.decodeU8a(u8a);
    assert(length.lten(MAX_LENGTH), `Vec length ${length.toString()} exceeds ${MAX_LENGTH}`);
    return decodeU8a(u8a.subarray(offset), new Array(length.toNumber()).fill(Type));
  }
  static with(Type) {
    return class extends Vec {
      constructor(value) {
        super(Type, value);
      }
    };
  }
  /**
   * @description The type for the items
   */
  get Type() {
    return this._Type.name;
  }
  /**
   * @description Finds the index of the value in the array
   */
  indexOf(_other) {
    // convert type first, this removes overhead from the eq
    const other = _other instanceof this._Type ? _other : new this._Type(_other);
    for (let i = 0; i < this.length; i++) {
      if (other.eq(this[i])) {
        return i;
      }
    }
    return -1;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `Vec<${new this._Type().toRawType()}>`;
  }
}
