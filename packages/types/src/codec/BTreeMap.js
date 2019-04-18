import { u8aConcat, u8aToU8a, u8aToHex } from '@polkadot/util';
import Compact from './Compact';
import decodeU8a from './utils/decodeU8a';
import U32 from '../U32';

// BTreeMap 前几个字节是 U32 表示长度
export default class BTreeMap extends Array {
  constructor(Type, value = []) {
    super(...BTreeMap.decodeBTreeMap(Type, value));
    this._Type = Type;
  }

  static decodeBTreeMap(Type, value) {
    if (Array.isArray(value)) {
      return value.map(entry => (entry instanceof Type ? entry : new Type(entry)));
    }
    const u8a = u8aToU8a(value);
    const _length = new U32(u8a);
    const length = _length.toNumber();
    const offset = _length.encodedLength;
    return decodeU8a(u8a.subarray(offset), new Array(length).fill(Type));
  }

  static with(Type) {
    return class BTreeMap extends BTreeMap {
      constructor(value) {
        super(Type, value);
      }
    };
  }

  get Type() {
    return this._Type.name;
  }

  get encodedLength() {
    return this.reduce((total, raw) => {
      return total + raw.encodedLength;
    }, new U32(this.length).encodedLength);
  }

  get length() {
    // only included here since we ignore inherited docs
    return super.length;
  }

  toArray() {
    return Array.from(this);
  }

  toHex() {
    return u8aToHex(this.toU8a());
  }

  toJSON() {
    return this.map(entry => entry.toJSON());
  }

  toString() {
    const data = this.map(entry => entry.toString());
    return `[${data.join(', ')}]`;
  }

  toU8a(isBare) {
    const encoded = this.map(entry => entry.toU8a(isBare));
    return isBare ? u8aConcat(...encoded) : u8aConcat(new U32(this.length).toU8a(), ...encoded);
  }

  filter(callbackfn, thisArg) {
    return this.toArray().filter(callbackfn, thisArg);
  }

  map(callbackfn, thisArg) {
    return this.toArray().map(callbackfn, thisArg);
  }
}
