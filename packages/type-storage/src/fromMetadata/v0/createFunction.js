// Copyright 2017-2019 @polkadot/storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import {
  v0SPlainType as PlainType,
  v0SStorageFunctionMetadata as StorageFunctionMetadata,
  v0SStorageFunctionModifier as StorageFunctionModifier,
  v0SStorageFunctionType as StorageFunctionType,
} from '@chainx/types/Metadata';
import { Compact, createType, StorageKey, Bytes, U8a } from '@chainx/types';
import { assert, isNull, isUndefined, stringLowerFirst, stringToU8a, u8aConcat } from '@polkadot/util';
import { xxhashAsU8a } from '@polkadot/util-crypto';
/**
 * From the schema of a function in the module's storage, generate the function
 * that will return the correct storage key.
 *
 * @param schema - The function's definition schema to create the function from.
 * The schema is taken from state_getMetadata.
 * @param options - Additional options when creating the function. These options
 * are not known at runtime (from state_getMetadata), they need to be supplied
 * by us manually at compile time.
 */
export default function createFunction(section, method, meta, options = {}) {
  const stringKey = options.key ? options.key : `${section.toString()} ${method.toString()}`;
  const rawKey = stringToU8a(stringKey);
  // Can only have zero or one argument:
  // - storage.balances.freeBalance(address)
  // - storage.timestamp.blockPeriod()
  const storageFn = arg => {
    let key = rawKey;
    if (meta.type.isMap) {
      assert(!isUndefined(arg) && !isNull(arg), `${meta.name} expects one argument`);
      const type = meta.type.asMap.key.toString();
      const param = createType(type, arg).toU8a(false);
      key = u8aConcat(key, param);
    }
    // StorageKey is a Bytes, so is length-prefixed
    return Compact.addLengthPrefix(options.isUnhashed ? key : xxhashAsU8a(key, 128));
  };
  if (meta.type.isMap && meta.type.asMap.isLinked) {
    // TODO: there needs some better way to do this
    const keyHash = new U8a(xxhashAsU8a(`head of ${stringKey}`, 128));
    const keyFn = () => keyHash;
    keyFn.meta = new StorageFunctionMetadata({
      name: meta.name,
      modifier: new StorageFunctionModifier('Required'),
      type: new StorageFunctionType(new PlainType(meta.type.asMap.key), 0),
      fallback: new Bytes(),
      documentation: meta.documentation,
    });
    storageFn.headKey = new StorageKey(keyFn);
  }
  storageFn.meta = meta;
  storageFn.method = stringLowerFirst(method.toString());
  storageFn.section = stringLowerFirst(section.toString());
  storageFn.toJSON = () => meta.toJSON();
  return storageFn;
}
