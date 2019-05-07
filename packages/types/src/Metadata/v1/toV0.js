// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { OuterDispatchCall, OuterDispatchMetadata } from '../v0/Calls';
import { EventMetadata, OuterEventMetadata, OuterEventMetadataEvent } from '../v0/Events';
import { CallMetadata, FunctionMetadata, RuntimeModuleMetadata, ModuleMetadata } from '../v0/Modules';
import { StorageFunctionMetadata, StorageMetadata, StorageFunctionType } from '../v0/Storage';
import MetadataV0 from '../v0/Metadata';
function storageV0(mod) {
  if (mod.storage.isNone) {
    return null;
  }
  return new StorageMetadata({
    prefix: mod.prefix,
    functions: mod.storage.unwrap().map(
      ({ documentation, fallback, modifier, name, type }) =>
        new StorageFunctionMetadata({
          name,
          modifier: modifier.toNumber(),
          type: new StorageFunctionType(type),
          fallback,
          documentation,
        })
    ),
  });
}
function moduleV0(mod) {
  return new ModuleMetadata({
    name: 'Module',
    call: new CallMetadata({
      name: 'Call',
      functions: mod.calls.isNone
        ? []
        : mod.calls.unwrap().map(
            ({ args, documentation, name }, id) =>
              new FunctionMetadata({
                id,
                name,
                arguments: args,
                documentation,
              })
          ),
    }),
  });
}
function modulesV0(v1) {
  return v1.modules.map(
    mod =>
      new RuntimeModuleMetadata({
        prefix: mod.name,
        module: moduleV0(mod),
        storage: storageV0(mod),
      })
  );
}
function outerDispatchV0(v1) {
  return new OuterDispatchMetadata({
    name: 'Call',
    calls: v1.modules
      .filter(({ calls }) => calls.isSome)
      .map(
        (mod, index) =>
          new OuterDispatchCall({
            // name and prefix are swapped in the actual V0 data, i.e. name is UpperCase
            name: mod.prefix,
            prefix: mod.name,
            index,
          })
      ),
  });
}
function outerEventV0(v1) {
  return new OuterEventMetadata({
    name: 'Event',
    events: v1.modules
      .filter(({ events }) => events.isSome)
      .map(
        mod =>
          new OuterEventMetadataEvent([
            mod.name,
            mod.events.unwrap().map(
              ({ args, documentation, name }) =>
                new EventMetadata({
                  name,
                  arguments: args,
                  documentation,
                })
            ),
          ])
      ),
  });
}
export default function toV0(v1) {
  return new MetadataV0({
    outerEvent: outerEventV0(v1),
    modules: modulesV0(v1),
    outerDispatch: outerDispatchV0(v1),
  });
}
