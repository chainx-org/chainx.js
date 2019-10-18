// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Option from '../../codec/Option';
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import { StorageMetadata } from './Storage';
/**
 * @name ModuleMetadataV7
 * @description
 * The definition of a module in the system
 */
export class ModuleMetadataV7 extends Struct {
  constructor(value) {
    super(
      {
        name: 'Text',
        storage: Option.with(StorageMetadata),
        calls: Option.with('Vec<FunctionMetadataV7>'),
        events: Option.with('Vec<EventMetadataV7>'),
        constants: 'Vec<ModuleConstantMetadataV7>',
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
 * @name MetadataV7
 * @description
 * The runtime metadata as a decoded structure
 */
export default class MetadataV7 extends Struct {
  constructor(value) {
    super(
      {
        modules: Vec.with(ModuleMetadataV7),
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
