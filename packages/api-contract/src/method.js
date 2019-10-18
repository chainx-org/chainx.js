// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { createClass, encodeType } from '@polkadot/types';
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
