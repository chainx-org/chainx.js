import { getTypeClass } from './getTypeClass';
import { getTypeDef } from './getTypeDef';

export function createClass(type) {
  return getTypeClass(getTypeDef(type));
}

// An unsafe version of the `createType` below. It's unsafe because the `type`
// argument here can be any string, which, if not parseable, will yield a
// runtime error.
export function ClassOfUnsafe(name) {
  return createClass(name);
}

// alias for createClass
export function ClassOf(name) {
  // TS2589: Type instantiation is excessively deep and possibly infinite.
  // The above happens with as Constructor<InterfaceRegistry[K]>;
  return ClassOfUnsafe(name);
}
