// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert } from '@chainx/util';
import Enum from '../../codec/Enum';
import Struct from '../../codec/Struct';
export class StorageFunctionType extends Enum {
  constructor(value, index) {
    super(
      {
        Type: 'PlainTypeV5',
        Map: 'MapTypeV5',
        DoubleMap: 'DoubleMapTypeV5',
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
      return `DoubleMap<${this.asDoubleMap.value.toString()}>`;
    }
    if (this.isMap) {
      if (this.asMap.linked.isTrue) {
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
        name: 'Text',
        modifier: 'StorageFunctionModifierV5',
        type: StorageFunctionType,
        fallback: 'Bytes',
        documentation: 'Vec<Text>',
      },
      value
    );
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
