// Copyright 2017-2019 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Method } from '@chainx/types';
import { assert, stringCamelCase } from '@polkadot/util';
/**
 * From the metadata of a function in the module's storage, generate the function
 * that will return the an [[MethodFunction]].
 *
 * @param section - Name of the module section.
 * @param sectionIndex - Index of the module section in the modules array.
 * @param methodIndex - Index of the method inside the section.
 * @param callMetadata - Metadata of the call function.
 */
export default function createDescriptor(section, sectionIndex, methodIndex, callMetadata) {
  const callIndex = new Uint8Array([sectionIndex, methodIndex]);
  const expectedArgs = callMetadata.args;
  const funcName = stringCamelCase(callMetadata.name.toString());
  const extrinsicFn = (...args) => {
    assert(
      expectedArgs.length.valueOf() === args.length,
      `Extrinsic ${section}.${funcName} expects ${expectedArgs.length.valueOf()} arguments, got ${args.length}.`
    );
    return new Method(
      {
        args,
        callIndex,
      },
      callMetadata
    );
  };
  extrinsicFn.callIndex = callIndex;
  extrinsicFn.meta = callMetadata;
  extrinsicFn.method = funcName;
  extrinsicFn.section = section;
  extrinsicFn.toJSON = () => callMetadata.toJSON();
  return extrinsicFn;
}
