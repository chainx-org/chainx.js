// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import {
  compactAddLength,
  compactFromU8a,
  compactStripLength,
  compactToU8a,
  isBn,
  isNumber,
  isString,
} from '@chainx/util';
import { DEFAULT_BITLENGTH } from '@chainx/util/compact/defaults';
import { typeToConstructor } from './utils';
import Base from './Base';
/**
 * @name Compact
 * @description
 * A compact length-encoding codec wrapper. It performs the same function as Length, however
 * differs in that it uses a variable number of bytes to do the actual encoding. This is mostly
 * used by other types to add length-prefixed encoding, or in the case of wrapped types, taking
 * a number and making the compact representation thereof
 */
export default class Compact extends Base {
  constructor(Type, value = 0) {
    super(Compact.decodeCompact(typeToConstructor(Type), value));
  }
  static with(Type) {
    return class extends Compact {
      constructor(value) {
        super(Type, value);
      }
    };
  }
  static stripLengthPrefix(u8a, bitLength = DEFAULT_BITLENGTH) {
    const [, value] = compactStripLength(u8a, bitLength);
    return value;
  }
  static decodeCompact(Type, value) {
    if (value instanceof Compact) {
      return new Type(value.raw);
    } else if (isString(value) || isNumber(value) || isBn(value)) {
      return new Type(value);
    }
    const [, _value] = Compact.decodeU8a(value, new Type(0).bitLength());
    return new Type(_value);
  }
  /**
   * @description Returns the number of bits in the value
   */
  bitLength() {
    return this.raw.bitLength();
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq(other) {
    return this.raw.eq(other instanceof Compact ? other.raw : other);
  }
  /**
   * @description Returns the BN representation of the number
   */
  toBn() {
    return this.raw.toBn();
  }
  /**
   * @description Returns the number representation for the value
   */
  toNumber() {
    return this.raw.toNumber();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `Compact<${this.raw.toRawType()}>`;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return Compact.encodeU8a(this.raw.toBn());
  }
  /**
   * @description Returns the embedded [[UInt]] or [[Moment]] value
   */
  unwrap() {
    return this.raw;
  }
}
/**
 * Prepend a Uint8Array with its compact length.
 *
 * @param u8a - The Uint8Array to be prefixed
 */
Compact.addLengthPrefix = compactAddLength;
Compact.decodeU8a = compactFromU8a;
Compact.encodeU8a = compactToU8a;
