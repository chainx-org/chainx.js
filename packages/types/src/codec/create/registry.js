import { isFunction, isString, isUndefined } from '@chainx/util';
import { createClass } from './createClass';
export class TypeRegistry {
  constructor() {
    this._classes = new Map();
    this._definitions = new Map();
  }
  // eslint-disable-next-line no-dupe-class-members
  register(arg1, arg2) {
    if (isString(arg1)) {
      const name = arg1;
      const type = arg2;
      this._classes.set(name, type);
    } else if (isFunction(arg1)) {
      const name = arg1.name;
      const type = arg1;
      this._classes.set(name, type);
    } else {
      this.registerObject(arg1);
    }
  }
  registerObject(obj) {
    Object.entries(obj).forEach(([name, type]) => {
      if (isFunction(type)) {
        // This _looks_ a bit funny, but `typeof Clazz === 'function'
        this._classes.set(name, type);
      } else {
        const def = isString(type) ? type : JSON.stringify(type);
        // we already have this type, remove the classes registered for it
        if (this._classes.has(name)) {
          this._classes.delete(name);
        }
        this._definitions.set(name, def);
      }
    });
  }
  get(name) {
    let Type = this._classes.get(name);
    // we have not already created the type, attempt it
    if (!Type) {
      const definition = this._definitions.get(name);
      // we have a definition, so create the class now (lazily)
      if (definition) {
        const BaseType = createClass(definition);
        // NOTE If we didn't extend here, we would have strange artifacts. An example is
        // Balance, with this, new Balance() instanceof u128 is true, but Balance !== u128
        Type = class extends BaseType {};
        this._classes.set(name, Type);
      }
    }
    return Type;
  }
  getDefinition(name) {
    return this._definitions.get(name);
  }
  getOrThrow(name, msg) {
    const type = this.get(name);
    if (isUndefined(type)) {
      throw new Error(msg || `type ${name} not found`);
    }
    return type;
  }
  hasClass(name) {
    return this._classes.has(name);
  }
  hasDef(name) {
    return this._definitions.has(name);
  }
  hasType(name) {
    return this.hasClass(name) || this.hasDef(name);
  }
}
TypeRegistry.defaultRegistry = new TypeRegistry();
export function getTypeRegistry() {
  return TypeRegistry.defaultRegistry;
}
