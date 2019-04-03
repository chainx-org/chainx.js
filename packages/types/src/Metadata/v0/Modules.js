// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Enum from '../../codec/Enum';
import EnumType from '../../codec/EnumType';
import Option from '../../codec/Option';
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Bytes from '../../Bytes';
import Text from '../../Text';
import Type from '../../Type';
import U16 from '../../U16';

export class FunctionArgumentMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        type: Type,
      },
      value
    );
  }
  /**
   * @description The argument name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description The [[Type]]
   */
  get type() {
    return this.get('type');
  }
}
export class FunctionMetadata extends Struct {
  constructor(value) {
    super(
      {
        id: U16,
        name: Text,
        arguments: Vector.with(FunctionArgumentMetadata),
        documentation: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The [[FunctionArgumentMetadata]] for arguments
   */
  get arguments() {
    return this.get('arguments');
  }
  /**
   * @description The [[Text]] documentation
   */
  get documentation() {
    return this.get('documentation');
  }
  /**
   * @description The `[sectionIndex, methodIndex]` call id
   */
  get id() {
    return this.get('id');
  }
  /**
   * @description The call name
   */
  get name() {
    return this.get('name');
  }
}
export class CallMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        functions: Vector.with(FunctionMetadata),
      },
      value
    );
  }
  /**
   * @description The functions available as [[FunctionMetadata]]
   */
  get functions() {
    return this.get('functions');
  }
  /**
   * @description The section name
   */
  get name() {
    return this.get('name');
  }
}
export class ModuleMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        call: CallMetadata,
      },
      value
    );
  }
  /**
   * @description The calls as [[CallMetadata]]
   */
  get call() {
    return this.get('call');
  }
  /**
   * @description The name
   */
  get name() {
    return this.get('name');
  }
}
export class StorageFunctionModifier extends Enum {
  constructor(value) {
    super(['Optional', 'Default', 'Required'], value);
  }
  /**
   * @description `true` if the storage entry is optional
   */
  get isOptional() {
    return this.toNumber() === 0;
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
class PlainType extends Type {}
export class StorageFunctionType extends EnumType {
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
export class StorageFunctionMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        modifier: StorageFunctionModifier,
        type: StorageFunctionType,
        default: Bytes,
        documentation: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The default value of the storage function
   */
  get default() {
    return this.get('default');
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
export class RuntimeModuleMetadata extends Struct {
  constructor(value) {
    super(
      {
        prefix: Text,
        module: ModuleMetadata,
        storage: Option.with(StorageMetadata),
      },
      value
    );
  }
  /**
   * @description The [[ModuleMetadata]]
   */
  get module() {
    return this.get('module');
  }
  /**
   * @description The prefix
   */
  get prefix() {
    return this.get('prefix');
  }
  /**
   * @description The optional [[StorageMetadata]]
   */
  get storage() {
    return this.get('storage');
  }
}
