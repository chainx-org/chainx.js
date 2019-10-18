// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { TypeDefInfo } from '../types';
import { assert } from '@chainx/util';
import { getTypeDef } from '../create';
const SPECIAL_TYPES = ['AccountId', 'AccountIndex', 'Address', 'Balance'];
export function paramsNotation(outer, inner, transform) {
  let array;
  if (inner) {
    array = Array.isArray(inner) ? inner : [inner];
    if (transform) {
      array = array.map(transform);
    }
  }
  return `${outer}${array ? `<${array.join(', ')}>` : ''}`;
}
class TypeEncoder {
  static enum(typeDef) {
    assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Enum type');
    const sub = typeDef.sub;
    const isClikeEnum = sub.reduce((bool, { type }) => bool && type === 'Null', true);
    if (isClikeEnum) {
      return `[${sub.map(({ name }) => `"${name}"`).join(', ')}]`;
    }
    return this.subTypes(sub, true);
  }
  static struct(typeDef) {
    assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Struct type');
    const sub = typeDef.sub;
    return this.subTypes(sub);
  }
  static tuple(typeDef) {
    assert(typeDef.sub && Array.isArray(typeDef.sub), 'Unable to encode Tuple type');
    const sub = typeDef.sub;
    return `(${sub.map(type => TypeEncoder.withParams(type)).join(', ')})`;
  }
  static vecFixed(typeDef) {
    assert(typeDef.ext, 'Unable to encode VecFixed type');
    const { type, length } = typeDef.ext;
    return `[${this.withParams(getTypeDef(type))};${length}]`;
  }
  static subTypes(sub, asEnum) {
    return `{ ${asEnum ? '"_enum": { ' : ''}${sub
      .map(type => `"${type.name}": "${this.withParams(type)}"`)
      .join(', ')}} }`;
  }
  static withParams(typeDef, outer = typeDef.displayName || typeDef.type) {
    const { params } = typeDef;
    return paramsNotation(outer, params, param => TypeEncoder.display(param));
  }
  static encode(typeDef) {
    switch (typeDef.info) {
      case TypeDefInfo.Null: {
        return '()';
      }
      case TypeDefInfo.Plain: {
        return typeDef.displayName || typeDef.type;
      }
      case TypeDefInfo.Compact: {
        return TypeEncoder.withParams(typeDef, 'Compact');
      }
      case TypeDefInfo.DoubleMap: {
        return TypeEncoder.withParams(typeDef, 'DoubleMap');
      }
      case TypeDefInfo.Linkage: {
        return TypeEncoder.withParams(typeDef, 'Linkage');
      }
      case TypeDefInfo.Option: {
        return TypeEncoder.withParams(typeDef, 'Option');
      }
      case TypeDefInfo.Result: {
        return TypeEncoder.withParams(typeDef, 'Result');
      }
      case TypeDefInfo.Vec: {
        return TypeEncoder.withParams(typeDef, 'Vec');
      }
      case TypeDefInfo.Enum: {
        return TypeEncoder.enum(typeDef);
      }
      case TypeDefInfo.Struct: {
        return TypeEncoder.struct(typeDef);
      }
      case TypeDefInfo.Tuple: {
        return TypeEncoder.tuple(typeDef);
      }
      case TypeDefInfo.VecFixed: {
        return TypeEncoder.vecFixed(typeDef);
      }
      default: {
        throw new Error(`Cannot encode type: ${typeDef}.`);
      }
    }
  }
  static display(typeDef) {
    if (typeDef.displayName) {
      return TypeEncoder.withParams(typeDef);
    }
    switch (typeDef.info) {
      case TypeDefInfo.Struct:
      case TypeDefInfo.Enum:
        return TypeEncoder.withParams(typeDef);
      default:
        return TypeEncoder.encode(typeDef);
    }
  }
}
export function encodeType(typeDef) {
  return TypeEncoder.encode(typeDef);
}
export function displayType(typeDef) {
  return TypeEncoder.display(typeDef);
}
export function withTypeString(typeDef) {
  return {
    ...typeDef,
    type: SPECIAL_TYPES.includes(typeDef.name) ? typeDef.name : encodeType(typeDef),
  };
}
