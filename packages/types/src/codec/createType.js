// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert, stringCamelCase} from '@polkadot/util';
import Compact from './Compact';
import Option from './Option';
import Struct from './Struct';
import Tuple from './Tuple';
import Vector from './Vector';
import BTreeMap from './BTreeMap';
import registry from './typeRegistry';
export var TypeDefInfo;
(function(TypeDefInfo) {
  TypeDefInfo[(TypeDefInfo['Compact'] = 0)] = 'Compact';
  TypeDefInfo[(TypeDefInfo['Option'] = 1)] = 'Option';
  TypeDefInfo[(TypeDefInfo['Plain'] = 2)] = 'Plain';
  TypeDefInfo[(TypeDefInfo['Struct'] = 3)] = 'Struct';
  TypeDefInfo[(TypeDefInfo['Tuple'] = 4)] = 'Tuple';
  TypeDefInfo[(TypeDefInfo['Vector'] = 5)] = 'Vector';
  TypeDefInfo[(TypeDefInfo['BTreeMap'] = 6)] = 'BTreeMap';
})(TypeDefInfo || (TypeDefInfo = {}));
// safely split a string on ', ' while taking care of any nested occurences
export function typeSplit(type) {
  let sDepth = 0;
  let tDepth = 0;
  let vDepth = 0;
  let start = 0;
  const result = [];
  for (let index = 0; index < type.length; index++) {
    switch (type[index]) {
      case ',':
        // we are not nested, add the type
        if (sDepth === 0 && tDepth === 0 && vDepth === 0) {
          result.push(type.substr(start, index - start).trim());
          start = index + 1;
        }
        break;
      // inc struct depth, start found
      case '{':
        sDepth++;
        break;
      // dec struct depth, end found
      case '}':
        sDepth--;
        break;
      // inc tuple depth, start found
      case '(':
        tDepth++;
        break;
      // dec tuple depth, end found
      case ')':
        tDepth--;
        break;
      // inc compact/vec depth, start found
      case '<':
        vDepth++;
        break;
      // dec compact/vec depth, end found
      case '>':
        vDepth--;
        break;
      // normal character
      default:
        break;
    }
  }
  assert(!sDepth && !tDepth && !vDepth, `Invalid defintion (missing terminators) found in ${type}`);
  // the final leg of the journey
  result.push(type.substr(start, type.length - start).trim());
  return result;
}
export function getTypeDef(_type, name) {
  const type = _type.toString().trim();
  const value = {
    info: TypeDefInfo.Plain,
    name,
    type,
  };
  let subType = '';
  const startingWith = (type, start, end) => {
    if (type.substr(0, start.length) !== start) {
      return false;
    }
    assert(type[type.length - 1] === end, `Expected '${start}' closing with '${end}'`);
    subType = type.substr(start.length, type.length - start.length - 1);
    return true;
  };
  if (startingWith(type, '(', ')')) {
    value.info = TypeDefInfo.Tuple;
    value.sub = typeSplit(subType).map(inner => getTypeDef(inner));
  } else if (startingWith(type, '{', '}')) {
    const parsed = JSON.parse(type);
    value.info = TypeDefInfo.Struct;
    value.sub = Object.keys(parsed).map(name => getTypeDef(parsed[name], name));
  } else if (startingWith(type, 'Compact<', '>')) {
    value.info = TypeDefInfo.Compact;
    value.sub = getTypeDef(subType);
  } else if (startingWith(type, 'Option<', '>')) {
    value.info = TypeDefInfo.Option;
    value.sub = getTypeDef(subType);
  } else if (startingWith(type, 'Vec<', '>')) {
    value.info = TypeDefInfo.Vector;
    value.sub = getTypeDef(subType);
  } else if (startingWith(type, 'BTreeMap<', '>')) {
    value.info = TypeDefInfo.BTreeMap;
    value.sub = subType.split(',').map(name => getTypeDef(name.trim(), stringCamelCase(name.trim())));
  }
  return value;
}
// Returns the type Class for construction
export function getTypeClass(value) {
  if (value.info === TypeDefInfo.Compact) {
    assert(value.sub && !Array.isArray(value.sub), 'Expected subtype for Compact');
    return Compact.with(getTypeClass(value.sub));
  } else if (value.info === TypeDefInfo.Option) {
    assert(value.sub && !Array.isArray(value.sub), 'Expected subtype for Option');
    return Option.with(getTypeClass(value.sub));
  } else if (value.info === TypeDefInfo.Struct) {
    assert(Array.isArray(value.sub), 'Expected nested subtypes for Struct');
    return Struct.with(
      value.sub.reduce((result, sub) => {
        result[sub.name] = getTypeClass(sub);
        return result;
      }, {})
    );
  } else if (value.info === TypeDefInfo.Tuple) {
    assert(Array.isArray(value.sub), 'Expected nested subtypes for Tuple');
    return Tuple.with(value.sub.map(getTypeClass));
  } else if (value.info === TypeDefInfo.Vector) {
    assert(value.sub && !Array.isArray(value.sub), 'Expected subtype for Vector');
    return Vector.with(getTypeClass(value.sub));
  } else if (value.info === TypeDefInfo.BTreeMap) {
    assert(value.sub && Array.isArray(value.sub), 'Expected subtype for BTreeMap');
    return BTreeMap.with(
      Struct.with(
        value.sub.reduce((result, sub) => {
          result[sub.name] = getTypeClass(sub);
          return result;
        }, {})
      )
    );
  }

  // NOTE We only load types via require - we have to avoid circular deps between type usage and creation
  const Types = require('../index');

  const Type = registry.get(value.type) || Types[value.type];

  assert(Type, `Unable to determine type from '${value.type}'`);
  return Type;
}
export function createClass(type, value) {
  return getTypeClass(getTypeDef(type));
}
export default function createType(type, value) {
  // l.debug(() => ['createType', { type, value }]);
  const Type = createClass(type);
  return new Type(value);
}
