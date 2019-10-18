// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Option from '../../codec/Option';
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import Text from '../../Text';
import Type from '../../Type';
import U16 from '../../U16';
import { StorageMetadata } from './Storage';
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
        args: Vec.with(FunctionArgumentMetadata),
        documentation: Vec.with(Text),
      },
      value
    );
  }
  /**
   * @description The arguments of [[Type]]
   */
  get args() {
    return this.get('args');
  }
  /**
   * @description The [[FunctionArgumentMetadata]] for arguments
   * @deprecated Use `.args` instead
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
   * @description The [[Text]] documentation
   * @deprecated Use `.documentation` instead.
   */
  get docs() {
    return this.documentation;
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
        functions: Vec.with(FunctionMetadata),
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
   * @description The calls as [[FunctionMetadata]]
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
