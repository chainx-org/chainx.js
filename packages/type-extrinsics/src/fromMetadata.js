// Copyright 2017-2019 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { stringCamelCase } from '@polkadot/util';
import createUnchecked from './utils/createUnchecked';

/**
 * Extend a storage object with the storage modules & module functions present
 * in the metadata.
 *
 * @param extrinsics - An extrinsics object to be extended.
 * @param metadata - The metadata to extend the storage object against.
 */
export default function fromMetadata(metadata) {
  const findIndex = prefix => {
    const mod = metadata.calls.find(item => item.get('prefix').toString() === prefix);
    return mod && mod.index.toNumber();
  };
  return metadata.modules.reduce((result, meta) => {
    if (!meta.module.call || !meta.module.call.functions.length) {
      return result;
    }
    const prefix = stringCamelCase(meta.prefix.toString());
    const index = findIndex(meta.prefix.toString());
    if (index === undefined) return result;

    result[prefix] = meta.module.call.functions.reduce((newModule, funcMeta) => {
      // extrinsics.balances.set_balance -> extrinsics.balances.setBalance
      const funcName = stringCamelCase(funcMeta.name.toString());
      newModule[funcName] = createUnchecked(prefix, funcName, index, funcMeta);
      return newModule;
    }, {});
    return result;
  }, {});
}
