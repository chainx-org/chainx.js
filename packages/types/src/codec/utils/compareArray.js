import { isFunction, isUndefined } from '@chainx/util';

// NOTE These are used internally and when comparing objects, expects that
// when the second is an Codec[] that the first has to be as well
export default function compareArray(a, b) {
  if (Array.isArray(b)) {
    return (
      a.length === b.length &&
      isUndefined(a.find((value, index) => (isFunction(value.eq) ? !value.eq(b[index]) : value !== b[index])))
    );
  }
  return false;
}
