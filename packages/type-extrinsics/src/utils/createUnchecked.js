// Copyright 2017-2018 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Method } from '@chainx/types';
import { assert } from '@polkadot/util';

/**
 * From the metadata of a function in the module's storage, generate the function
 * that will return the an UncheckExtrinsic.
 *
 * @param index - Index of the module section in the modules array.
 */
export default function createDescriptor(section, method, index, meta) {
  const callIndex = new Uint8Array([index, meta.id.toNumber()]);
  let extrinsicFn;
  const expectedArgs = Method.filterOrigin(meta);
  extrinsicFn = (...args) => {
    assert(
      expectedArgs.length.valueOf() === args.length,
      `Extrinsic ${section}.${method} expects ${expectedArgs.length.valueOf()} arguments, got ${args.length}.`
    );
    return new Method(
      {
        args,
        callIndex,
      },
      meta
    );
  };
  extrinsicFn.callIndex = callIndex;
  extrinsicFn.meta = meta;
  extrinsicFn.method = method;
  extrinsicFn.section = section;
  extrinsicFn.toJSON = () => meta.toJSON();
  return extrinsicFn;
}
