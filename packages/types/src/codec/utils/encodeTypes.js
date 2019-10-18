// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { TypeDefInfo } from '../types';
import { assert } from '@chainx/util';
import { getTypeDef } from '../create';
const SPECIAL_TYPES = ['AccountId', 'AccountIndex', 'Address', 'Balance'];

const identity = value => value;

export function paramsNotation(outer, inner, transform = identity) {
  let arrayStr = '';
  if (inner) {
    arrayStr = '<' + (Array.isArray(inner) ? inner : [inner]).map(transform).join(', ') + '>';
  }
  return `${outer}${arrayStr}`;
}
function encodeWithParams(typeDef, outer = typeDef.displayName || typeDef.type) {
  const { params } = typeDef;
  return paramsNotation(
    outer,
    params,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    param => displayType(param)
  );
}
function encodeSubTypes(sub, asEnum) {
  return `{ ${asEnum ? '"_enum": { ' : ''}${sub
    .map(type => `"${type.name}": "${encodeWithParams(type)}"`)
    .join(', ')} }`;
}
function encodeEnum(typeDef) {
  assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Enum type');
  const sub = typeDef.sub;
  const isClikeEnum = sub.reduce((bool, { type }) => bool && type === 'Null', true);
  if (isClikeEnum) {
    return `[${sub.map(({ name }) => `"${name}"`).join(', ')}]`;
  }
  return encodeSubTypes(sub, true);
}
function encodeStruct(typeDef) {
  assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Struct type');
  const sub = typeDef.sub;
  return encodeSubTypes(sub);
}
function encodeTuple(typeDef) {
  assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Tuple type');
  const sub = typeDef.sub;
  return `(${sub.map(type => encodeWithParams(type)).join(', ')})`;
}
function encodeVecFixed(typeDef) {
  assert(typeDef.ext, 'Unable to encode VecFixed type');
  const { type, length } = typeDef.ext;
  return `[${encodeWithParams(getTypeDef(type))};${length}]`;
}
// We setup a record here to ensure we have comprehensive coverage (any item not covered will result
// in a compile-time error with the missing index)
const encoders = {
  [TypeDefInfo.BTreeMap]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'BTreeMap'),
  [TypeDefInfo.Compact]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'Compact'),
  [TypeDefInfo.DoubleMap]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'DoubleMap'),
  [TypeDefInfo.Enum]: typeDef => typeDef.displayName || encodeEnum(typeDef),
  [TypeDefInfo.Linkage]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'Linkage'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [TypeDefInfo.Null]: typeDef => 'Null',
  [TypeDefInfo.Option]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'Option'),
  [TypeDefInfo.Plain]: typeDef => typeDef.displayName || typeDef.type,
  [TypeDefInfo.Result]: typeDef => encodeWithParams(typeDef, 'Result'),
  [TypeDefInfo.Set]: typeDef => typeDef.type,
  [TypeDefInfo.Struct]: typeDef => typeDef.displayName || encodeStruct(typeDef),
  [TypeDefInfo.Tuple]: typeDef => typeDef.displayName || encodeTuple(typeDef),
  [TypeDefInfo.Vec]: typeDef => typeDef.displayName || encodeWithParams(typeDef, 'Vec'),
  [TypeDefInfo.VecFixed]: typeDef => typeDef.displayName || encodeVecFixed(typeDef),
};

export function encodeType(typeDef) {
  const encoder = encoders[typeDef.info];
  assert(encoder, `Cannot encode type: ${typeDef}.`);
  return encoder(typeDef);
}

export function displayType(typeDef) {
  if (typeDef.displayName) {
    return encodeWithParams(typeDef);
  }
  switch (typeDef.info) {
    case TypeDefInfo.Struct:
    case TypeDefInfo.Enum:
      return encodeWithParams(typeDef);
    default:
      return encodeType(typeDef);
  }
}

export function withTypeString(typeDef) {
  return {
    ...typeDef,
    type: SPECIAL_TYPES.includes(typeDef.name) ? typeDef.name : encodeType(typeDef),
  };
}
