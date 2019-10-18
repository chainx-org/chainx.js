// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, isU8a, u8aConcat, compactToU8a } from '@chainx/util';
import AbstractArray from './AbstractArray';
import { typeToConstructor } from './utils';
import Vec from './Vec';
/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */
export default class VecFixed extends AbstractArray {
  constructor(Type, length, value = []) {
    const Clazz = typeToConstructor(Type);
    super(...VecFixed.decodeVecFixed(Clazz, length, value));
    this._Type = Clazz;
  }
  static decodeVecFixed(Type, allocLength, value) {
    const values = Vec.decodeVec(Type, isU8a(value) ? u8aConcat(compactToU8a(allocLength), value) : value);
    while (values.length < allocLength) {
      values.push(new Type());
    }
    assert(values.length === allocLength, `Expected a length of exactly ${allocLength} entries`);
    return values;
  }
  static with(Type, length) {
    return class extends VecFixed {
      constructor(value) {
        super(Type, length, value);
      }
    };
  }
  /**
   * @description The type for the items
   */
  get Type() {
    return new this._Type().toRawType();
  }
  toU8a() {
    // we override, we don't add the length prefix for outselves, and at the same time we
    // ignore isBare on entries, since they should be properly encoded at all times
    const encoded = this.map(entry => entry.toU8a());
    return u8aConcat(...encoded);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType() {
    return `[${this.Type};${this.length}]`;
  }
}
