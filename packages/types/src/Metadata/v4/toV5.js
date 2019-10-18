import { assert } from '@chainx/util';
import { createType, Option, Vec } from '../../codec';
import StorageHasher from '../../StorageHasher';
import MetadataV5 from '../v5';
import { ModuleMetadataV5 } from '../v5/Metadata';
import { StorageFunctionMetadata, StorageFunctionType } from '../v5/Storage';

const hasherMap = new Map([
  ['blake2_128', 'Blake2_128'],
  ['blake2_256', 'Blake2_256'],
  ['twox_128', 'Twox128'],
  ['twox_256', 'Twox256'],
  ['twox_64_concat', 'Twox64Concat'],
]);

function toStorageHasher(text) {
  const mapped = hasherMap.get(text.toString());
  assert(mapped, `Invalid Storage hasher: ${text.toString()}`);
  return new StorageHasher(mapped);
}

/**
 * Convert V4 StorageFunction to V5 StorageFunction
 */
function toV5StorageFunction(storageFn) {
  const { documentation, fallback, modifier, name, type } = storageFn;
  const [newType, index] = type.isPlainType
    ? [type, 0]
    : type.isMap
    ? [type.asMap, 1]
    : [
        createType('DoubleMapTypeV5', {
          hasher: type.asDoubleMap.hasher,
          key1: type.asDoubleMap.key1,
          key2: type.asDoubleMap.key2,
          value: type.asDoubleMap.value,
          key2Hasher: toStorageHasher(type.asDoubleMap.key2Hasher),
        }),
        2,
      ];
  return new StorageFunctionMetadata({
    documentation,
    fallback,
    name,
    modifier,
    type: new StorageFunctionType(newType, index),
  });
}
/**
 * Convert from MetadataV4 to MetadataV5
 * See https://github.com/paritytech/substrate/pull/2836/files for details
 */
export default function toV5({ modules }) {
  return new MetadataV5({
    modules: modules.map(
      ({ calls, events, name, prefix, storage }) =>
        new ModuleMetadataV5({
          name,
          prefix,
          storage: storage.isSome
            ? new Option(Vec.with(StorageFunctionMetadata), storage.unwrap().map(toV5StorageFunction))
            : undefined,
          calls,
          events,
        })
    ),
  });
}
