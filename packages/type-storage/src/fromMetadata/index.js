// Copyright 2017-2019 @polkadot/storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { stringLowerFirst } from '@chainx/util';
import createFunction from './createFunction';
import { storage } from './storage';
/**
 * Extend a storage object with the storage modules & module functions present
 * in the metadata.
 *
 * @param storage - A storage object to be extended.
 * @param metadata - The metadata to extend the storage object against.
 */
export default function fromMetadata(metadata) {
  return metadata.asV5.modules.reduce(
    (result, moduleMetadata) => {
      if (moduleMetadata.storage.isNone) {
        return result;
      }
      const prefix = moduleMetadata.prefix;
      // For access, we change the index names, i.e. Balances.FreeBalance -> balances.freeBalance
      result[stringLowerFirst(prefix.toString())] = moduleMetadata.storage
        .unwrap()
        .reduce((newModule, storageFnMeta) => {
          newModule[stringLowerFirst(storageFnMeta.name.toString())] = createFunction(
            prefix,
            storageFnMeta.name,
            storageFnMeta
          );
          return newModule;
        }, {});
      return result;
    },
    { ...storage }
  );
}
