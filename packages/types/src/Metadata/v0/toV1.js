// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { stringUpperFirst } from '@chainx/util';
import { createType, Option, Vec } from '../../codec';

function toV1Calls({
  module: {
    call: { functions },
  },
}) {
  return functions.length
    ? new Option(Vec.with('FunctionMetadataV1'), functions)
    : new Option(Vec.with('FunctionMetadataV1'));
}
function toV1Events(metadataV0, prefix) {
  const events = metadataV0.outerEvent.events.find(event => event[0].eq(prefix));
  return events ? new Option(Vec.with('EventMetadataV1'), events[1]) : new Option(Vec.with('EventMetadataV1'));
}
function toV1Storage({ storage }) {
  return storage.isSome
    ? new Option('Vec<StorageFunctionMetadataV1>', storage.unwrap().functions)
    : new Option('Vec<StorageFunctionMetadataV1>');
}
/**
 * Function that converts MetadataV0 to MetadataV1
 */
export default function toV1(metadataV0) {
  return createType('MetadataV1', {
    modules: metadataV0.modules.map(mod => {
      // The prefix of this module (capitalized)
      const prefix = mod.storage.isSome
        ? mod.storage.unwrap().prefix.toString()
        : stringUpperFirst(mod.prefix.toString()); // If this module doesn't have storage, we just assume the prefix is the name capitalized
      return createType('ModuleMetadataV1', {
        name: mod.prefix,
        prefix,
        storage: toV1Storage(mod),
        calls: toV1Calls(mod),
        events: toV1Events(metadataV0, mod.prefix),
      });
    }),
  });
}
