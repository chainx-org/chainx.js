// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { bnToHex, bnToU8a } from '@chainx/util';
import { ClassOf } from './create';
import AbstractInt, { DEFAULT_UINT_BITS } from './AbstractInt';
/**
 * @name UInt
 * @description
 * A generic unsigned integer codec. For Substrate all numbers are Little Endian encoded,
 * this handles the encoding and decoding of those numbers. Upon construction
 * the bitLength is provided and any additional use keeps the number to this
 * length. This extends `BN`, so all methods available on a normal `BN` object
 * is available here.
 * @noInheritDoc
 */
export default class UInt extends AbstractInt {
  constructor(value = 0, bitLength = DEFAULT_UINT_BITS, isHexJson = false) {
    super(false, value, bitLength, isHexJson);
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex(isLe = false) {
    // For display/JSON, this is BE, for compare, use isLe
    return bnToHex(this, {
      bitLength: this._bitLength,
      isLe,
      isNegative: false,
    });
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    // NOTE In the case of balances, which have a special meaning on the UI
    // and can be interpreted differently, return a specific value for it so
    // underlying it always matches (no matter which length it actually is)
    return this instanceof ClassOf('Balance') ? 'Balance' : `u${this._bitLength}`;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toU8a(isBare) {
    return bnToU8a(this, {
      bitLength: this._bitLength,
      isLe: true,
      isNegative: false,
    });
  }
}
