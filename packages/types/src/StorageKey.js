// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isFunction } from '@polkadot/util';
import Bytes from './Bytes';
/**
 * @name StorageKey
 * @description
 * A representation of a storage key (typically hashed) in the system. It can be
 * constructed by passing in a raw key or a StorageFunction with (optional) arguments.
 */
export default class StorageKey extends Bytes {
  constructor(value) {
    super(StorageKey.decodeStorageKey(value));
    this._outputType = StorageKey.getType(value);
  }
  static decodeStorageKey(value) {
    if (isFunction(value)) {
      return value();
    } else if (Array.isArray(value)) {
      const [fn, arg] = value;
      if (isFunction(fn)) {
        return fn(arg);
      }
    }
    return value;
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
    return null;
  }
  /**
   * @description The output type, `null` when not available
   */
  get outputType() {
    return this._outputType;
  }
}
