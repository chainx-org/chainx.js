// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import EnumType from '../../codec/EnumType';
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Bytes from '../../Bytes';
import Null from '../../Null';
import Text from '../../Text';
import Type from '../../Type';

export class Default extends Null {}
export class Optional extends Null {}
export class MetadataStorageModifier extends EnumType {
  constructor(value, index) {
    super(
      {
        Optional,
        Default,
      },
      value,
      index
    );
  }
  /**
   * @description `true` if the storage entry is optional
   */
  get isOptional() {
    return this.toNumber() === 0;
  }
  toJSON() {
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
export class MetadataStorageType extends EnumType {
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
   * @description `true` if the storage entry is a map
   */
  get isMap() {
    return this.toNumber() === 1;
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
   * @description Returns the string representation of the value
   */
  toString() {
    return this.isMap ? this.asMap.value.toString() : this.asType.toString();
  }
}
/**
 * @name MetadataModule
 * @description
 * The definition of a storage function
 */
export class MetadataStorage extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        modifier: MetadataStorageModifier,
        type: MetadataStorageType,
        fallback: Bytes,
        docs: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The [[Text]] documentation
   */
  get docs() {
    return this.get('docs');
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
   * @description The [[MetadataStorageType]]
   */
  get type() {
    return this.get('type');
  }
}
