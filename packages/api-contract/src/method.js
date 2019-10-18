import { createClass, encodeType } from '@chainx/types';

export function createArgClass(args, baseDef) {
  return createClass(
    JSON.stringify(
      args.reduce((base, { name, type }) => {
        base[name] = encodeType(type);
        return base;
      }, baseDef)
    )
  );
}
