import { TypeDefInfo } from './types';
import { assert } from '@chainx/util';
import BTreeMap from '../BTreeMap';
import Compact from '../Compact';
import Enum from '../Enum';
import Linkage from '../Linkage';
import Option from '../Option';
import Result from '../Result';
import CodecSet from '../Set';
import Struct from '../Struct';
import Tuple from '../Tuple';
import U8aFixed from '../U8aFixed';
import Vec from '../Vec';
import VecFixed from '../VecFixed';
import { ClassOf } from './createClass';
import { getTypeRegistry } from './registry';

function getSubDefArray(value) {
  assert(value.sub && Array.isArray(value.sub), `Expected subtype as TypeDef[] in ${JSON.stringify(value)}`);
  return value.sub;
}
function getSubDef(value) {
  assert(value.sub && !Array.isArray(value.sub), `Expected subtype as TypeDef in ${JSON.stringify(value)}`);
  return value.sub;
}
function getSubType(value) {
  return getSubDef(value).type;
}
// create a maps of type string constructors from the input
function getTypeClassMap(value) {
  const result = {};
  return getSubDefArray(value).reduce((result, sub) => {
    result[sub.name] = sub.type;
    return result;
  }, result);
}

// create an array of type string constructors from the input
function getTypeClassArray(value) {
  return getSubDefArray(value).map(({ type }) => type);
}

const infoMapping = {
  [TypeDefInfo.BTreeMap]: value => {
    const [keyType, valueType] = getTypeClassArray(value);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return BTreeMap.with(keyType, valueType);
  },
  [TypeDefInfo.Compact]: value => Compact.with(getSubType(value)),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  [TypeDefInfo.DoubleMap]: value => getTypeClass(getSubDef(value)),
  [TypeDefInfo.Enum]: value => Enum.with(getTypeClassMap(value)),
  [TypeDefInfo.Linkage]: value => Linkage.withKey(getSubType(value)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [TypeDefInfo.Null]: _ => ClassOf('Null'),
  [TypeDefInfo.Option]: value => Option.with(getSubType(value)),
  [TypeDefInfo.Plain]: value =>
    getTypeRegistry().getOrThrow(value.type, `Unable to find plain type for ${JSON.stringify(value)}`),
  [TypeDefInfo.Result]: value => {
    const [Ok, Error] = getTypeClassArray(value);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return Result.with({ Ok, Error });
  },
  [TypeDefInfo.Set]: value => {
    const result = {};
    return CodecSet.with(
      getSubDefArray(value).reduce((result, { name, index }) => {
        result[name] = index;
        return result;
      }, result)
    );
  },
  [TypeDefInfo.Struct]: value => Struct.with(getTypeClassMap(value)),
  [TypeDefInfo.Tuple]: value => Tuple.with(getTypeClassArray(value)),
  [TypeDefInfo.Vec]: value => {
    const subType = getSubType(value);
    return subType === 'u8' ? ClassOf('Bytes') : Vec.with(subType);
  },
  [TypeDefInfo.VecFixed]: value => {
    assert(value.ext, 'Expected length & type information for fixed vector');
    const ext = value.ext;
    return ext.type === 'u8' ? U8aFixed.with(ext.length * 8) : VecFixed.with(ext.type, ext.length);
  },
};
// Returns the type Class for construction
export function getTypeClass(value) {
  const Type = getTypeRegistry().get(value.type);
  if (Type) {
    return Type;
  }
  const getFn = infoMapping[value.info];
  if (!getFn) {
    throw new Error(`Unable to determine type from ${JSON.stringify(value)}`);
  }
  return getFn(value);
}
