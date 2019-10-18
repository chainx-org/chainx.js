// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert } from '@chainx/util';
import Enum from '../../codec/Enum';
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Bool from '../../Bool';
import Bytes from '../../Bytes';
import StorageHasher from '../../StorageHasher';
import Text from '../../Text';
import Type from '../../Type';
import { PlainType, StorageFunctionModifier } from '../v3/Storage';
// Re-export classes that haven't changed between V3 and V4
export { PlainType, StorageFunctionModifier };

export class MapType extends Struct {
  constructor(value) {
    super(
      {
        hasher: StorageHasher,
        key: Type,
        value: Type,
        isLinked: Bool,
      },
      value
    );
  }
  /**
   * @description The hash algorithm used to hash keys, as [[StorageHasher]]
   */
  get hasher() {
    return this.get('hasher');
  }
  /**
   * @description Is this an enumerable linked map
   */
  get isLinked() {
    return this.get('isLinked').valueOf();
  }
  /**
   * @description The mapped key as [[Type]]
   */
  get key() {
    return this.get('key');
  }
  /**
   * @description The mapped value as [[Type]]
   */
  get value() {
    return this.get('value');
  }
}

export class DoubleMapType extends Struct {
  constructor(value) {
    super(
      {
        hasher: StorageHasher,
        key1: Type,
        key2: Type,
        value: Type,
        key2Hasher: Text,
      },
      value
    );
  }
  /**
   * @description The hashing algorithm used to hash keys, as [[StorageHasher]]
   */
  get hasher() {
    return this.get('hasher');
  }
  /**
   * @description The mapped key as [[Type]]
   */
  get key1() {
    return this.get('key1');
  }
  /**
   * @description The mapped key as [[Type]]
   */
  get key2() {
    return this.get('key2');
  }
  /**
   * @description The hashing algorithm used to hash key2, as [[Text]]
   */
  get key2Hasher() {
    return this.get('key2Hasher');
  }
  /**
   * @description The mapped key as [[Type]]
   */
  get value() {
    return this.get('value');
  }
}
export class StorageFunctionType extends Enum {
  constructor(value, index) {
    super(
      {
        PlainType,
        MapType,
        DoubleMapType,
      },
      value,
      index
    );
  }
  /**
   * @description The value as a mapped value
   */
  get asDoubleMap() {
    assert(this.isDoubleMap, `Cannot convert '${this.type}' via asDoubleMap`);
    return this.value;
  }
  /**
   * @description The value as a mapped value
   */
  get asMap() {
    assert(this.isMap, `Cannot convert '${this.type}' via asMap`);
    return this.value;
  }
  /**
   * @description The value as a [[Type]] value
   */
  get asType() {
    assert(this.isPlainType, `Cannot convert '${this.type}' via asType`);
    return this.value;
  }
  /**
   * @description `true` if the storage entry is a doublemap
   */
  get isDoubleMap() {
    return this.toNumber() === 2;
  }
  /**
   * @description `true` if the storage entry is a map
   */
  get isMap() {
    return this.toNumber() === 1;
  }
  /**
   * @description `true` if the storage entry is a plain type
   */
  get isPlainType() {
    return this.toNumber() === 0;
  }
  /**
   * @description Returns the string representation of the value
   */
  toString() {
    if (this.isDoubleMap) {
      return `DoubleMap<${this.asDoubleMap.toString()}>`;
    }
    if (this.isMap) {
      if (this.asMap.isLinked) {
        return `(${this.asMap.value.toString()}, Linkage<${this.asMap.key.toString()}>)`;
      }
      return this.asMap.value.toString();
    }
    return this.asType.toString();
  }
}
/**
 * @name StorageFunctionMetadata
 * @description
 * The definition of a storage function
 */

export class StorageFunctionMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        modifier: StorageFunctionModifier,
        type: StorageFunctionType,
        fallback: Bytes,
        documentation: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The default value of the storage function
   * @deprecated Use `.fallback` instead.
   */
  get default() {
    return this.fallback;
  }
  /**
   * @description The default value of the storage function
   */
  get fallback() {
    return this.get('fallback');
  }
  /**
   * @description The [[Text]] documentation
   */
  get documentation() {
    return this.get('documentation');
  }
  /**
   * @description The [[Text]] documentation
   * @deprecated Use `.documentation` instead.
   */
  get docs() {
    return this.documentation;
  }
  /**
   * @description The key name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description The modifier
   */
  get modifier() {
    return this.get('modifier');
  }
  /**
   * @description The [[StorageFunctionType]]
   */
  get type() {
    return this.get('type');
  }
}
