// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isFunction, isString } from '@polkadot/util';
import { createClass } from './createType';
export class TypeRegistry {
  constructor() {
    this._registry = new Map();
  }
  register(arg1, arg2) {
    if (isString(arg1)) {
      const name = arg1;
      const type = arg2;
      this._registry.set(name, type);
    } else if (isFunction(arg1)) {
      const name = arg1.name;
      const type = arg1;
      this._registry.set(name, type);
    } else {
      this.registerObject(arg1);
    }
  }
  registerObject(obj) {
    Object.entries(obj).forEach(([name, type]) => {
      if (isString(type)) {
        this._registry.set(name, createClass(type));
      } else if (isFunction(type)) {
        // This _looks_ a bit funny, but `typeof Clazz === 'function'
        this._registry.set(name, type);
      } else {
        this._registry.set(name, createClass(JSON.stringify(type)));
      }
    });
  }
  get(name) {
    return this._registry.get(name);
  }
}
TypeRegistry.defaultRegistry = new TypeRegistry();
export default TypeRegistry.defaultRegistry;
