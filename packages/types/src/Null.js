// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/**
 * @name Null
 * @description
 * Implements a type that does not contain anything (apart from `null`)
 */
export default class Null {
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    return 0;
  }
  /**
   * @description Returns a hex string representation of the value
   */
  toHex() {
    return '0x';
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    return null;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    return '';
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    return new Uint8Array();
  }
}
