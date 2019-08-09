import { decodeAddress, encodeAddress } from '@chainx/keyring';
import { hexToU8a, isHex, isString, isU8a, u8aToU8a } from '@chainx/util';
import U8aFixed from './codec/U8aFixed';

export default class PublicKey extends U8aFixed {
  constructor(value = new Uint8Array()) {
    super(PublicKey.decodeAccountId(value), 256);
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
}
