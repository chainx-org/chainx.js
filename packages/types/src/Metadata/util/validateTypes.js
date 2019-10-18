// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { TypeDefInfo } from '../../codec/types';
import { getTypeDef } from '../../codec/create';
import flattenUniq from './flattenUniq';
import { getTypeRegistry } from '../../codec';

function extractTypes(types) {
  return types.map(type => {
    const decoded = getTypeDef(type);
    switch (decoded.info) {
      case TypeDefInfo.Plain:
        return decoded.type;
      case TypeDefInfo.Compact:
      case TypeDefInfo.Option:
      case TypeDefInfo.Vec:
        return extractTypes([decoded.sub.type]);
      case TypeDefInfo.VecFixed:
        return extractTypes([decoded.ext.type]);
      case TypeDefInfo.Result:
      case TypeDefInfo.Tuple:
        return extractTypes(decoded.sub.map(sub => sub.type));
      default:
        throw new Error(`Unhandled: Unable to create and validate type from ${type}`);
    }
  });
}
export default function validateTypes(types, throwError) {
  const typeRegistry = getTypeRegistry();
  const missing = flattenUniq(extractTypes(types)).filter(type => !typeRegistry.hasType(type));
  if (missing.length !== 0) {
    const message = `Unknown types found, no types for ${missing}`;
    if (throwError) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
}
