import { isString } from '@chainx/util';
import { ClassOf } from '../create';
export function typeToConstructor(type) {
  return isString(type) ? ClassOf(type) : type;
}
/**
 * @description takes an input map of the form `{ [string]: string | Constructor }` and returns a map of `{ [string]: Conbstructor }`
 */
export function mapToTypeMap(input) {
  const output = {};
  Object.entries(input).forEach(([key, type]) => {
    output[key] = typeToConstructor(type);
  });
  return output;
}
