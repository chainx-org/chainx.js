// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex, isString, isU8a, u8aToU8a } from '@polkadot/util';
import U8aFixed from './codec/U8aFixed';
/**
 * @name AccountId
 * @description
 * A wrapper around an AccountId/PublicKey representation. Since we are dealing with
 * underlying PublicKeys (32 bytes in length), we extend from U8aFixed which is
 * just a Uint8Array wrapper with a fixed length.
 */
export default class AccountId extends U8aFixed {
  constructor(value = new Uint8Array()) {
    super(AccountId.decodeAccountId(value), 256);
  }
  static encode(value) {
    return encodeAddress(value);
  }
  static decodeAccountId(value) {
    if (isU8a(value) || Array.isArray(value)) {
      return u8aToU8a(value);
    } else if (isHex(value)) {
      return hexToU8a(value.toString());
    } else if (isString(value)) {
      return decodeAddress(value.toString());
    }
    return value;
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
    return AccountId.encode(this);
  }
}
