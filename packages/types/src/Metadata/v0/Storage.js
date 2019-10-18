// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { assert } from '@chainx/util';
import Enum from '../../codec/Enum';
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Bytes from '../../Bytes';
import Text from '../../Text';
import Type from '../../Type';
export class StorageFunctionModifier extends Enum {
  constructor(value) {
    console.log(value);
    super(['Optional', 'Default', 'Required'], value);
  }
  /**
   * @description `true` if the storage entry is optional
   */
  get isOptional() {
    return this.toNumber() === 0;
  }
  toJSON() {
    // This looks prettier in the generated JSON
    return this.toString();
  }
}
export class MapType extends Struct {
  constructor(value) {
    super(
      {
        key: Type,
        value: Type,
      },
      value
    );
    this._isLinked = false;
    if (value && value.isLinked) {
      this._isLinked = true;
    }
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
    return this._isLinked;
  }
}
export class PlainType extends Type {}
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
export class StorageMetadata extends Struct {
  constructor(value) {
    super(
      {
        prefix: Text,
        functions: Vector.with(StorageFunctionMetadata),
      },
      value
    );
  }
  /**
   * @description The [[StorageFunctionMetadata]] for the section
   */
  get functions() {
    return this.get('functions');
  }
  /**
   * @description The section prefix
   */
  get prefix() {
    return this.get('prefix');
  }
}
