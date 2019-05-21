// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, isFunction, isString, isU8a } from '@polkadot/util';
import Bytes from './Bytes';
/**
 * @name StorageKey
 * @description
 * A representation of a storage key (typically hashed) in the system. It can be
 * constructed by passing in a raw key or a StorageFunction with (optional) arguments.
 */
export default class StorageKey extends Bytes {
  constructor(value) {
    const { key, method, section } = StorageKey.decodeStorageKey(value);
    super(key);
    this._meta = StorageKey.getMeta(value);
    this._method = method;
    this._outputType = StorageKey.getType(value);
    this._section = section;
  }
  static decodeStorageKey(value) {
    if (value instanceof StorageKey) {
      return {
        key: value,
        method: value.method,
        section: value.section,
      };
    } else if (!value || isString(value) || isU8a(value)) {
      // let Bytes handle these inputs
      return {
        key: value,
      };
    } else if (isFunction(value)) {
      return {
        key: value(),
        method: value.method,
        section: value.section,
      };
    } else if (Array.isArray(value)) {
      const [fn, ...arg] = value;
      assert(isFunction(fn), 'Expected function input for key construction');
      return {
        key: fn(...arg),
        method: fn.method,
        section: fn.section,
      };
    }
    throw new Error(`Unable to convert input ${value} to StorageKey`);
  }
  static getMeta(value) {
    if (value instanceof StorageKey) {
      return value.meta;
    } else if (isFunction(value)) {
      return value.meta;
    } else if (Array.isArray(value)) {
      const [fn] = value;
      return fn.meta;
    }
    return undefined;
  }
  static getType(value) {
    if (value instanceof StorageKey) {
      return value.outputType;
    } else if (isFunction(value)) {
      return value.meta.type.toString();
    } else if (Array.isArray(value)) {
      const [fn] = value;
      return fn.meta.type.toString();
    }
    return undefined;
  }
  /**
   * @description The metadata or `undefined` when not available
   */
  get meta() {
    return this._meta;
  }
  /**
   * @description The key method or `undefined` when not specified
   */
  get method() {
    return this._method;
  }
  /**
   * @description The output type, `null` when not available
   */
  get outputType() {
    return this._outputType;
  }
  /**
   * @description The key section or `undefined` when not specified
   */
  get section() {
    return this._section;
  }
}
