// Copyright 2017-2019 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { stringCamelCase } from '@chainx/util';
import extrinsics from '../';
import createUnchecked from './createUnchecked';
/**
 * Extend a storage object with the storage modules & module functions present
 * in the metadata.
 *
 * @param extrinsics - An extrinsics object to be extended.
 * @param metadata - The metadata to extend the storage object against.
 */
export default function fromMetadata(metadata) {
  return metadata.asLatest.modules
    .filter(modul => modul.calls.isSome)
    .reduce(
      (result, modul, sectionIndex) => {
        const prefix = stringCamelCase(modul.prefix.toString());
        result[prefix] = modul.calls.unwrap().reduce((newModule, callMetadata, methodIndex) => {
          const funcName = stringCamelCase(callMetadata.name.toString());
          newModule[funcName] = createUnchecked(prefix, sectionIndex, methodIndex, callMetadata);
          return newModule;
        }, {});
        return result;
      },
      { ...extrinsics }
    );
}
