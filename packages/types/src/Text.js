// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, isString, stringToU8a, u8aToString, u8aToHex, isHex, u8aToU8a } from '@chainx/util';
import Compact from './codec/Compact';
/**
 * @name Text
 * @description
 * This is a string wrapper, along with the length. It is used both for strings as well
 * as items such as documentation. It simply extends the standard JS `String` built-in
 * object, inheriting all methods exposed from `String`.
 * @noInheritDoc
 */
// TODO
//   - Strings should probably be trimmed (docs do come through with extra padding)
//   - Potentially we want a "TypeString" extension to this. Basically something that
//     wraps the `Balance`, `T::AccountId`, etc. The reasoning - with a "TypeString"
//     we can nicely strip types down like "T::AcountId" -> "AccountId"
export default class Text extends String {
  constructor(value = '') {
    super(Text.decodeText(value));
    // 奇怪的编码
    //if (value instanceof Uint8Array) {
    // this._rawU8a = Text.decodeU8a(value);
    //}
  }

  static decodeU8a(value) {
    if (!value.length) {
      return Uint8Array.from([]);
    }

    const [offset, length] = Compact.decodeU8a(value);
    const total = offset + length.toNumber();

    assert(
      total <= value.length,
      `Text: required length less than remainder, expected at least ${total}, found ${value.length}`
    );

    return value.subarray(offset, total);
  }

  static decodeText(value) {
    if (isString(value)) {
      return value.toString();
    } else if (isHex(value)) {
      return u8aToString(u8aToU8a(value));
    } else if (value instanceof Uint8Array) {
      if (!value.length) {
        return '';
      }

      //const [offset, length] = Compact.decodeU8a(value);
      //const total = offset + length.toNumber();

      return u8aToString(u8aToU8a(value));

      //return u8aToString(value.subarray(offset, total));
    }

    return `${value}`;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return this.toU8a().length;
  }
  /**
   * @description The length of the value
   */
  get length() {
    // only included here since we ignore inherited docs
    return super.length;
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
    return this.toString();
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    // only included here since we do not inherit docs
    return super.toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    if (this._rawU8a) {
      return isBare ? this._rawU8a : Compact.addLengthPrefix(this._rawU8a);
    }
    const encoded = stringToU8a(this.toString());
    return isBare ? encoded : Compact.addLengthPrefix(encoded);
  }
}
