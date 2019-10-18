// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isNull, isU8a, isUndefined, u8aToHex } from '@chainx/util';
import Null from '../primitive/Null';
import { typeToConstructor } from './utils';
import Base from './Base';
/**
 * @name Option
 * @description
 * An Option is an optional field. Basically the first byte indicates that there is
 * is value to follow. If the byte is `1` there is an actual value. So the Option
 * implements that - decodes, checks for optionality and wraps the required structure
 * with a value if/as required/found.
 */
export default class Option extends Base {
  constructor(Type, value) {
    const Clazz = typeToConstructor(Type);
    super(Option.decodeOption(Clazz, value));
    this._Type = Clazz;
  }
  static decodeOption(Type, value) {
    if (isNull(value) || isUndefined(value) || value instanceof Null) {
      return new Null();
    } else if (value instanceof Option) {
      return Option.decodeOption(Type, value.value);
    } else if (value instanceof Type) {
      // don't re-create, use as it (which also caters for derived types)
      return value;
    } else if (isU8a(value)) {
      // the isU8a check happens last in the if-tree - since the wrapped value
      // may be an instance of it, so Type and Option checks go in first
      return Option.decodeOptionU8a(Type, value);
    }
    return new Type(value);
  }
  static decodeOptionU8a(Type, value) {
    return !value.length || value[0] === 0 ? new Null() : new Type(value.subarray(1));
  }
  static with(Type) {
    return class extends Option {
      constructor(value) {
        super(Type, value);
      }
    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    // boolean byte (has value, doesn't have) along with wrapped length
    return 1 + this.raw.encodedLength;
  }
  /**
   * @description Checks if the Option has no value
   */
  get isEmpty() {
    return this.isNone;
  }
  /**
   * @description Checks if the Option has no value
   */
  get isNone() {
    return this.raw instanceof Null;
  }
  /**
   * @description Checks if the Option has a value
   */
  get isSome() {
    return !this.isNone;
  }
  /**
   * @description The actual value for the Option
   */
  get value() {
    return this.raw;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    if (other instanceof Option) {
      return this.isSome === other.isSome && this.value.eq(other.value);
    }
    return this.value.eq(other);
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    // This attempts to align with the JSON encoding - actually in this case
    // the isSome value is correct, however the `isNone` may be problematic
    return this.isNone ? '0x' : u8aToHex(this.toU8a().subarray(1));
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType(isBare) {
    const wrapped = new this._Type().toRawType();
    return isBare ? wrapped : `Option<${wrapped}>`;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    if (isBare) {
      return this.raw.toU8a(true);
    }
    const u8a = new Uint8Array(this.encodedLength);
    if (this.isSome) {
      u8a.set([1]);
      u8a.set(this.raw.toU8a(), 1);
    }
    return u8a;
  }
  /**
   * @description Returns the value that the Option represents (if available), throws if null
   */
  unwrap() {
    if (this.isNone) {
      throw new Error('Option: unwrapping a None value');
    }
    return this.raw;
  }
  /**
   * @description Returns the value that the Option represents (if available) or defaultValue if none
   * @param defaultValue The value to return if the option isNone
   */
  unwrapOr(defaultValue) {
    return this.isSome ? this.unwrap() : defaultValue;
  }
}
