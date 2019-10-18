// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert } from '@chainx/util';
import Enum from '../../codec/Enum';
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import Bool from '../../Bool';
import Bytes from '../../Bytes';
import Text from '../../Text';
import Type from '../../Type';
import { PlainType, StorageFunctionModifier } from '../v1/Storage';
// Re-export classes that haven't changed between V1 and V2
export { PlainType, StorageFunctionModifier };
export class MapType extends Struct {
  constructor(value) {
    super(
      {
        key: Type,
        value: Type,
        isLinked: Bool,
      },
      value
    );
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
  /**
   * @description Is this an enumerable linked map
   */
  get isLinked() {
    return this.get('isLinked').valueOf();
  }
}
export class StorageFunctionType extends Enum {
  constructor(value, index) {
    super(
      {
        PlainType,
        MapType,
      },
      value,
      index
    );
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
 * @name ModuleMetadata
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
        documentation: Vec.with(Text),
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
