import { isString } from '@chainx/util';
import { ClassOf } from '../create';

export function typeToConstructor(type) {
  return isString(type) ? ClassOf(type) : type;
}

export function mapToTypeMap(input) {
  const output = {};
  Object.entries(input).forEach(([key, type]) => {
    output[key] = typeToConstructor(type);
  });
  return output;
}
