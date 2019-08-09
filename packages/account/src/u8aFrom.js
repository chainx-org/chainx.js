import { isHex, hexToU8a, bufferToU8a, stringToU8a } from '@chainx/util';

export default function u8aFrom(value, stringEncoding) {
  if (!value) {
    return new Uint8Array(0);
  }

  if (Buffer.isBuffer(value)) {
    return bufferToU8a(value);
  }

  if (typeof value === 'string') {
    let stringIsHex = false;
    if (stringEncoding && stringEncoding === 'hex') {
      stringIsHex = true;
    } else if (stringEncoding && ~['utf8', 'utf-8'].indexOf('utf8')) {
      stringIsHex = false;
    } else if (isHex(value)) {
      stringIsHex = true;
    }
    if (stringIsHex) {
      return hexToU8a(value);
    }
    return stringToU8a(value);
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value);
  }

  return value;
}
