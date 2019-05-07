// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import EnumType from '../../codec/EnumType';
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Bytes from '../../Bytes';
import Text from '../../Text';
import { MapType, PlainType, StorageFunctionModifier } from '../v2/Storage';
// Re-export classes that haven't changed between V2 and V3
export { MapType, PlainType, StorageFunctionModifier };
export class DoubleMapType extends Struct {
  constructor(value) {
    super(
      {
        key1: Text,
        key2: Text,
        value: Text,
        key2Hasher: Text,
      },
      value
    );
  }
  /**
   * @description The mapped key as [[Text]]
   */
  get key1() {
    return this.get('key1');
  }
  /**
   * @description The mapped key as [[Text]]
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
   * @description The mapped key as [[Text]]
   */
  get value() {
    return this.get('value');
  }
}
export class StorageFunctionType extends EnumType {
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
    return this.value;
  }
  /**
   * @description The value as a mapped value
   */
  get asMap() {
    return this.value;
  }
  /**
   * @description The value as a [[Type]] value
   */
  get asType() {
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
   * @description Returns the string representation of the value
   */
  toString() {
    if (this.isDoubleMap) {
      return this.asDoubleMap.toString();
    }
    return this.isMap ? this.asMap.value.toString() : this.asType.toString();
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
   * @description The [[Bytes]] fallback default
   */
  get fallback() {
    return this.get('fallback');
  }
  /**
   * @description The [[MetadataArgument]] for arguments
   */
  get modifier() {
    return this.get('modifier');
  }
  /**
   * @description The call name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description The [[StorageFunctionType]]
   */
  get type() {
    return this.get('type');
  }
}
