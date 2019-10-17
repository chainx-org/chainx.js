import { isU8a, u8aToHex } from '@chainx/util';
import { createClass } from './createClass';
function u8aHasValue(value) {
  return value.some(v => !!v);
}
// With isPedantic, actually check that the encoding matches that supplied. This
// is much slower, but verifies that we have the correct types defined
function checkInstance(value, created) {
  // For option, we are not adding  the initial byte (this is via storage)
  const crHex = created.toHex(true);
  const inHex = u8aToHex(value);
  // if the hex doesn't match and the value for both is non-empty, complain... bitterly
  if (inHex !== crHex && (u8aHasValue(value) || u8aHasValue(created.toU8a(true)))) {
    console.warn(`${created.toRawType()}:: Input doesn't match output, received ${inHex}, created ${crHex}`);
  }
}
// Initializes a type with a value. This also checks for fallbacks and in the cases
// where isPedantic is specified (storage decoding), also check the format/structure
function initType(Type, params = [], isPedantic) {
  const created = new Type(...params);
  const [value] = params;
  if (isPedantic && isU8a(value)) {
    checkInstance(value, created);
  }
  return created;
}
// An unsafe version of the `createType` below. It's unsafe because the `type`
// argument here can be any string, which, if not parseable, will yield a
// runtime error.
export function createTypeUnsafe(type, params = [], isPedantic) {
  try {
    return initType(createClass(type), params, isPedantic);
  } catch (error) {
    throw new Error(`createType(${type}):: ${error.message}`);
  }
}
/**
 * Create an instance of a `type` with a given `params`.
 * @param type - A recognizable string representing the type to create an
 * instance from
 * @param params - The value to instantiate the type with
 */
export function createType(type, ...params) {
  // error TS2589: Type instantiation is excessively deep and possibly infinite.
  // The above happens with as Constructor<InterfaceRegistry[K]>;
  return createTypeUnsafe(type, params);
}
