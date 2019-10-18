// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import flattenUniq from './flattenUniq';
import validateTypes from './validateTypes';
function unwrapCalls(mod) {
  return mod.calls
    ? mod.calls.unwrapOr([])
    : // V0
    mod.module
    ? mod.module.call.functions
    : [];
}
function getCallNames({ modules }) {
  return modules.map(mod => unwrapCalls(mod).map(({ args }) => args.map(arg => arg.type.toString())));
}
function getConstantNames({ modules }) {
  return modules.map(({ constants }) => (constants ? constants.map(constant => constant.type.toString()) : []));
}
function unwrapEvents(events) {
  if (!events) {
    return [];
  }
  return events.unwrapOr([]);
}
function getEventNames({ modules, outerEvent }) {
  const mapArg = ({ args }) => args.map(arg => arg.toString());
  // V0
  if (outerEvent) {
    return outerEvent.events.map(([, events]) => events.map(mapArg));
  }
  // V1+
  return modules.map(({ events }) => unwrapEvents(events).map(mapArg));
}
function unwrapStorage(storage) {
  if (!storage) {
    return [];
  }
  const data = storage.unwrapOr([]);
  return Array.isArray(data) ? data : data.items || data.functions;
}
function getStorageNames({ modules }) {
  return modules.map(({ storage }) =>
    unwrapStorage(storage).map(({ type }) => {
      if (type.isDoubleMap && type.asDoubleMap) {
        return [type.asDoubleMap.key1.toString(), type.asDoubleMap.key2.toString(), type.asDoubleMap.value.toString()];
      } else if (type.isMap) {
        return [type.asMap.key.toString(), type.asMap.value.toString()];
      } else {
        return [type.asType.toString()];
      }
    })
  );
}
export default function getUniqTypes(meta, throwError) {
  const types = flattenUniq([getCallNames(meta), getConstantNames(meta), getEventNames(meta), getStorageNames(meta)]);
  validateTypes(types, throwError);
  return types;
}
