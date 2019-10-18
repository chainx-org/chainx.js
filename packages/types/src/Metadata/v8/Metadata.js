// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Option from '../../codec/Option';
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import { StorageMetadata } from './Storage';
// Note the following errors are non-duplicated and fill the first 2 slots for
// each of the modules - this means that other errors start at index 2
//
// {
//   "name": "Other",
//   "documentation": [
//     "Other unspecified error"
//   ]
// },
// {
//   "name": "CannotLookup",
//   "documentation": [
//     "Can not lookup"
//   ]
// }
/**
 * @name ModuleMetadataV8
 * @description
 * The definition of a module in the system
 */
export class ModuleMetadataV8 extends Struct {
  constructor(value) {
    super(
      {
        name: 'Text',
        storage: Option.with(StorageMetadata),
        calls: Option.with('Vec<FunctionMetadataV8>'),
        events: Option.with('Vec<EventMetadataV8>'),
        constants: 'Vec<ModuleConstantMetadataV8>',
        errors: 'Vec<ErrorMetadataV8>',
      },
      value
    );
  }
  /**
   * @description the module calls
   */
  get calls() {
    return this.get('calls');
  }
  /**
   * @description the module constants
   */
  get constants() {
    return this.get('constants');
  }
  /**
   * @description the module errors
   */
  get errors() {
    return this.get('errors');
  }
  /**
   * @description the module events
   */
  get events() {
    return this.get('events');
  }
  /**
   * @description the module name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description the associated module storage
   */
  get storage() {
    return this.get('storage');
  }
}
/**
 * @name MetadataV8
 * @description
 * The runtime metadata as a decoded structure
 */
export default class MetadataV8 extends Struct {
  constructor(value) {
    super(
      {
        modules: Vec.with(ModuleMetadataV8),
      },
      value
    );
  }
  /**
   * @description The associated modules for this structure
   */
  get modules() {
    return this.get('modules');
  }
}
